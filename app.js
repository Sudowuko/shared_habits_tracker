//Test commit due to using a new device
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const CommandsDeploy = require('./deploy');

require('dotenv').config();

const project_id = process.env.PROJECT_ID;
const credential = applicationDefault();

initializeApp({
  credential,
  projectId: project_id
});

const db = getFirestore();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {

  CommandsDeploy.deployCommands(client);
  console.log(`Logged in as ${client.user.tag}!`);
  
});

//Used when a slash command is sent by a user
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName)
  if (!command) return;
  try {
    command.execute(interaction)
  } catch (e) {
    console.log(e);
    await interaction.reply("Code is still broken :(")
  }
});

client.login(process.env.DISCORD_TOKEN);