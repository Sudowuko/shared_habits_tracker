// If there is no way to use a stop command, it's possible to run the stop portion from startdailymessage

const { SlashCommandBuilder } = require('@discordjs/builders');

// Store the intervals for each user
const intervals = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stopdailymessage')
        .setDescription('Stop the daily message interval'),

    async execute(interaction) {
        // Get the user's ID
        const userId = interaction.user.id;

        if (intervals[userId]) {
            // Clear the interval if it exists
            clearInterval(intervals[userId]);
            delete intervals[userId]; // Remove the interval reference

            // Respond to the user
            await interaction.reply('Daily message interval stopped.');
        } else {
            await interaction.reply('No daily message interval is currently running.');
        }
    },
};
