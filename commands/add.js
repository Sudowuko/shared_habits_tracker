const { SlashCommandBuilder, SlashCommandStringOption} = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
	data: new SlashCommandBuilder().setName('add').setDescription('adds user tokens'),
	async execute(interaction) {
        interaction.reply("third command works!")
    }
}