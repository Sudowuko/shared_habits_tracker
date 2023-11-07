const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');

//TODO

/*
Make parameters optional
If command is ran a second time that is the ending break condition
If that becomes solution, rename command to just dailymessage as there is no need to separate files
*/

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

const buttonLabels = {};
const intervals = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startdailymessage')
        .setDescription('create automatic team message for habit tracking')
        .addStringOption(option =>
            option.setName('hours')
                .setDescription('Set scheduled hour for daily message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mins')
                .setDescription('Set scheduled minute for daily message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('Set hour interval time for daily message')
                .setRequired(true)),
    async execute(interaction) {

        // Variables for daily message content
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

        //Scheduling time and interval variables
        const scheduleHour = parseInt(interaction.options.getString('hours'));
        const scheduleMin = parseInt(interaction.options.getString('mins'));
        const scheduleInterval = parseInt(interaction.options.getString('interval'));
        const schedule = `${scheduleMin} ${scheduleHour} * * *`;
        
        // Team variables
        const teamsRef = db.collection('teams');
        const teamInfo = await teamsRef.get();

        // Looping for repeated messages
        const userId = interaction.user.id;
        await interaction.deferReply();
        if (intervals[userId]) {
            interaction.editReply('Daily Message Schedule has already been set and is currently running');
        }
        else {
            cron.schedule(schedule, () => {
                intervals[userId] = setInterval(() => {
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
                    });
                    const row = new ActionRowBuilder().addComponents(...buttons);
                    interaction.followUp({ content: messageContent, components: [row] });
                }, scheduleInterval * 1000); //Note: Currently changed to seconds for testing purposes
                
            })
            interaction.editReply(`Daily messages has been scheduled and will start at ${scheduleHour}:${scheduleMin}! Daily message will be repeating every ${scheduleInterval} hour(s)`);
        }

        const filter = (i) => i.isButton() && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 300000,
        });

        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());

        // Logic for all button and point collecting
        collector.on('collect', async (interaction) => {
            const buttonId = interaction.customId;
            const buttonName = buttonLabels[buttonId];
            const userSnapshot = await docRef.get();
            const userTeamName = userSnapshot.data()?.team;
            const userClickedButtons = userSnapshot.data()?.clicked_buttons || [];

            try {
                if (userTeamName === buttonName && !userClickedButtons.includes(buttonId)) {
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
        });
    },
};