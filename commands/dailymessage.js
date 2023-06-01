const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

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
      const teamButton = new ButtonBuilder()
        .setCustomId(teamName)
        .setLabel(teamName)
        .setStyle(ButtonStyle.Primary);

      buttons.push(teamButton);
    });

    const row = new ActionRowBuilder().addComponents(...buttons);

    const messageContent = 'Test Message';
    interaction.reply({ content: messageContent, components: [row] });

    const filter = (interaction) =>
      interaction.isButton() && interaction.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 150000,
    });

    const user = interaction.user;
    const docRef = db.collection('users').doc(user.id.toString());
    const updated_user = await docRef.get();
    const userTeamName = updated_user.data().team;
    const userClickedButtons = [];

    collector.on('collect', async (interaction) => {
      const buttonId = interaction.customId;
      console.log('User ID:', interaction.user.id);
      console.log('User Team:', userTeamName);
      console.log('Button Team:', buttonId);

      if (userTeamName === buttonId && !userClickedButtons.includes(buttonId)) {
        console.log('Monthly update successful');
        docRef.update({
          monthly_logs: admin.firestore.FieldValue.increment(1),
        });
        userClickedButtons.push(buttonId);

       // const currentDate = new Date().toLocaleDateString();
        const pointMessage = `Habit Completed!`;

        try {
          await interaction.user.send(pointMessage);
        } catch (error) {
          console.error(`Failed to send message to user: ${error}`);
        }
      } else {
        const clickedMessage = 'Wrong Team Selected!';

        try {
          await interaction.user.send(clickedMessage);
        } catch (error) {
          console.error(`Failed to send message to user: ${error}`);
        }
      }
    });

    collector.on('end', () => {
      console.log('Button collector ended');
    });
  },
};
