const { REST, Routes } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

require('dotenv').config();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'buttons',
    description: 'Select one of the buttons'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

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
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pongo!');
  }

  if (commandName === 'buttons') {

    const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('Team A')
					.setLabel('Team A')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('Team B')
					.setLabel('Team B')
					.setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
					.setCustomId('Team C')
					.setLabel('Team C')
					.setStyle(ButtonStyle.Primary),
			);
    const messageContent = "Test Message"
   // const inputs = { components: [row1], components: [row2]}
		await interaction.reply({ content: messageContent, components: [row]});
   // await interaction.reply({ content: 'I think you should click button 2,', components: [row2] });
   // await interaction.reply({ content: 'I think you should click button 3,', components: [row3] });
  }

});

client.login(process.env.DISCORD_TOKEN);