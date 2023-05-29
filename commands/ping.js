const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('New description pong'),
    async execute(interaction) {
        interaction.reply("Test successful, ping pong!")
    }
	
}