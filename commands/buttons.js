const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = { 
    data: new SlashCommandBuilder().setName('buttons').setDescription('create team buttons'),
    async execute(interaction) {
        console.log("test");
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
        const messageContent = 'Test Message';
        interaction.reply({ content: messageContent, components: [row] });
	}

};


