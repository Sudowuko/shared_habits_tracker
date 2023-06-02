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

        const messageContent = 'Test Message';
        interaction.reply({ content: messageContent, components: [row] });

        const filter = (i) => i.isButton() && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 300000,
        });

        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());

        const collectedInteractions = [];

        collector.on('collect', async (interaction) => {
            const buttonId = interaction.customId;
            const buttonName = buttonLabels[buttonId];

            console.log('User ID:', interaction.user.id);
            console.log('Button ID:', buttonId);
            console.log('Button Team Name:', buttonName);

            const userSnapshot = await docRef.get();
            const userTeamName = userSnapshot.data()?.team;
            const userClickedButtons = userSnapshot.data()?.clicked_buttons || [];

            try {
                if (userTeamName === buttonName && !userClickedButtons.includes(buttonId)) {
                    docRef.update({
                        monthly_logs: admin.firestore.FieldValue.increment(1),
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
            collectedInteractions.push(interaction);
        });

        collector.on('end', () => {
            console.log('Button collector ended');
            // Additional logic after collecting all interactions
        });



        collector.on('end', () => {
            console.log('Button collector ended');
        });
    },
};
