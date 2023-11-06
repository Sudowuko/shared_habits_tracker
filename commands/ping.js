const { SlashCommandBuilder } = require('@discordjs/builders');

// An array to store the interval IDs
const intervals = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Send repeated messages every 10 seconds'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Check if there's already an interval running for this user
        if (intervals[userId]) {
            interaction.reply('You already started the ping interval.');
        } else {
            // Start a new interval for the user
            intervals[userId] = setInterval(() => {
                interaction.followUp('Ping!');
            }, 10000); // 10000 milliseconds = 10 seconds

            interaction.reply('Ping interval started! You will receive a message every 10 seconds.');
        }
    },
};
