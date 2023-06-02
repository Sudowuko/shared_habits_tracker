const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

const buttonLabels = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailymessage')
        .setDescription('create automatic team message for habit tracking'),
    async execute(interaction) {
        const teamsRef = db.collection('teams');
        const teamInfo = await teamsRef.get();

        const buttons = [];
        teamInfo.forEach((team) => {
            const teamName = team.get('team_name');
            const buttonId = uuidv4().substr(0, 7);
            buttonLabels[buttonId] = teamName;

            const teamButton = new ButtonBuilder()
                .setCustomId(buttonId)
                .setLabel(teamName)
                .setStyle(ButtonStyle.Primary);

            buttons.push(teamButton);
            console.log("Adding Labels: " + buttonLabels[buttonId]);
        });
        console.log("All Buttons: " + buttons);

        const row = new ActionRowBuilder().addComponents(...buttons);

        const currentDate = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonth = monthNames[currentDate.getMonth()];

        const challengerChatId = '969621130610606190';

        const messageContent = `**Daily Habit Challenge**

**${currentMonth} Competition**

Hello fam!! This is your daily reminder that it's time to log your habits!!

Don't forget to click on your Team Button if you have completed your habit today!

If you want to share more about what you did or talk about any other topics, feel free to use <#${challengerChatId}>

Hope you had a fantastic day and good luck for tomorrow!! `;

        interaction.reply({ content: messageContent, components: [row] });

        const filter = (i) => i.isButton() && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 300000,
        });

        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());

        collector.on('collect', async (interaction) => {
            const buttonId = interaction.customId;
            const buttonName = buttonLabels[buttonId];

            console.log('User ID:', interaction.user.id);
            console.log('Button ID:', buttonId);
            console.log('Button Team Name:\n', buttonName);

            const userSnapshot = await docRef.get();
            const userTeamName = userSnapshot.data()?.team;
            const userClickedButtons = userSnapshot.data()?.clicked_buttons || [];

            try {
                if (userTeamName === buttonName && !userClickedButtons.includes(buttonId)) {
                    console.log("Points Increasing")
                    const logsToAdd = 1; // Points to add per interaction
                    const tokensToAdd = 10;

                    // Calculate the total for monthly logs
                    const currentLogs = userSnapshot.data()?.monthly_logs || 0;
                    const newLogs = currentLogs + logsToAdd;

                    // Calculate the total for tokens
                    const currentTokens = userSnapshot.data()?.tokens || 0;
                    const newTokens = currentTokens + tokensToAdd;

                    docRef.update({
                        tokens: newTokens,
                        monthly_logs: newLogs,
                        clicked_buttons: admin.firestore.FieldValue.arrayUnion(buttonId),
                    });
                    const currentDate = new Date().toLocaleDateString();
                    const message = `Congrats on completing your habit on ${currentDate}!`;
                    await interaction.reply({ content: message, ephemeral: true });
                } else if (userTeamName === buttonName && userClickedButtons.includes(buttonId)) {
                    const message = `Your habit has already been marked as completed!`;
                    await interaction.reply({ content: message, ephemeral: true });
                } else {
                    const message = 'Wrong Team Selected!';
                    await interaction.reply({ content: message, ephemeral: true });
                }
            } catch (error) {
                if (error.code === 40060) {
                    console.log('Interaction already acknowledged');
                } else {
                    console.error('Error:', error);
                }
            }
        });

        collector.on('end', () => {
            console.log('Button collector ended');
            // Additional logic after collecting all interactions
        });
    },
};
