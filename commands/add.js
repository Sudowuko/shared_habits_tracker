const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('add').setDescription('adds user tokens'),
	async execute(interaction) {
        interaction.reply("third command works! :D")
    }
}