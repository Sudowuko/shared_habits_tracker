const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

module.exports = {
  data: new SlashCommandBuilder().setName('dailymessage').setDescription('create automatic team message for habit tracking'),
  async execute(interaction) {
    const teamsRef = db.collection('teams');
    const teamInfo = await teamsRef.get();

    const buttons = [];
    teamInfo.forEach((team) => {
      const teamName = team.get('team_name');
      const teamButton = new ButtonBuilder()
        .setCustomId(teamName)
        .setLabel(teamName)
        .setStyle(ButtonStyle.Primary);

      buttons.push(teamButton);
    });

    const row = new ActionRowBuilder().addComponents(...buttons);

    const messageContent = 'Test Message';
    interaction.reply({ content: messageContent, components: [row] });
  },
};
