const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { Interaction } = require("discord.js")
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const { Intents, MessageEmbed } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType, MessageButton, MessageActionRow } = require('discord.js');
const CommandsDeploy = require('./deploy');

require('dotenv').config();

//const commands = require('./src/commands');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'buttons',
    description: 'Select one of the buttons'
  },
  {
    name: 'stats',
    description: 'Allows user to view their own personal stats'
  },
  {
    name: 'addTokens',
    description: 'Adds to tokens to the user'
  },
  {
    name: 'removeTokens',
    description: 'Removes tokens from the user'
  }

];

const project_id = process.env.PROJECT_ID;
const credential = applicationDefault();

initializeApp({
  credential,
  projectId: project_id
});

const db = getFirestore();
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);


// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');
//     await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error("Error is: ", error);
//   }
// })();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  //Load commands
  CommandsDeploy.deployCommands(client);

  console.log(`Logged in as ${client.user.tag}!`);
  
  client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
      const buttonId = interaction.customId;
      console.log(`Button clicked: ${buttonId}`);
      await interaction.reply(`Button clicked: ${buttonId}`);
    }
  });
});

//Used when a slash command is sent by a user
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName)
  console.log("Command is: ", command)
  if (!command) return;
  try {
    command.execute(interaction)
  } catch (e) {
    console.log(e);
    await interaction.reply("Code is still broken :(")

  }
});

client.login(process.env.DISCORD_TOKEN);