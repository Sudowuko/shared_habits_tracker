const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedulemessage')
        .setDescription('Schedules a daily message for the competition'),
    async execute(interaction) {
        // Acknowledge the command
        // interaction.reply('Scheduling the daily message...');

        // Define the delay in milliseconds (10 seconds)
        const delay = 2 * 1000;

        // Use setTimeout to execute the dailymessage logic after the specified delay
        setTimeout(() => {
            console.log("Test 0");
            // Your daily message logic here (call dailymessage or include its logic here)
            const dailymessageCommand = interaction.client.commands.get('dailymessage');
            console.log("Test 1")
            if (dailymessageCommand) {
                console.log("Test 2")
                dailymessageCommand.execute(interaction);
                console.log("Test 3")
            }
        }, delay);
    },
};
