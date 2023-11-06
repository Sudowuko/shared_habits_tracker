//TEST COMMAND HAS NO MAIN FUNCTIONALITY
const { SlashCommandBuilder } = require('@discordjs/builders');
const cron = require('node-cron');

// An array to store the interval IDs
const intervals = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Send repeated messages every 10 seconds starting at 3:15 PM'),

    async execute(interaction) {
        await interaction.deferReply(); // Defer the initial reply

        const userId = interaction.user.id;

        // Check if there's already an interval running for this user
        if (intervals[userId]) {
            interaction.editReply('You already started the ping interval.');
        } else {
            cron.schedule('06 18 * * *', () => {
                // Start a new interval for the user
                intervals[userId] = setInterval(() => {
                    interaction.followUp('Ping!'); // Edit the initial reply to send subsequent messages

                }, 10000); // 10000 milliseconds = 10 seconds

                interaction.editReply('Ping interval started! You will receive a message every 10 seconds starting at 3:15 PM.');
            });
        }
    },
};
