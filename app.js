const {REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType,  MessageButton, MessageActionRow } = require('discord.js');
const { handleButtonInteraction, handleCommandInteraction } = require('./src/interactions');

require('dotenv').config();

const commands = require('./src/commands');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    }
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  await handleCommandInteraction(interaction);
});

client.login(process.env.DISCORD_TOKEN);