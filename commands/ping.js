const { SlashCommandBuilder, SlashCommandStringOption} = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('New description pong'),
    async execute(interaction) {
        interaction.reply("New test ping test v2")
    }
	
}