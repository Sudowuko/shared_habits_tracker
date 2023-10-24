const { SlashCommandBuilder } = require('@discordjs/builders');
const cron = require('node-cron');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedulemessage')
        .setDescription('Schedules a daily message for the competition'),
    async execute(interaction) {
        console.log("daily message part 0")
        // Schedule the message at 5:40 PM using cron (your cron syntax here)
        cron.schedule('53 17 * * *', () => {
            // Your daily message logic here (call dailymessage or include its logic here)
            const dailymessageCommand = client.commands.get('dailymessage');
            console.log("daily message part 1")
            if (dailymessageCommand) {
                console.log("daily message part 2")
                dailymessageCommand.execute(interaction);
                console.log("daily message part 3")
            }
        });

        interaction.reply('Daily message has been scheduled at 5:48pm.');
    }
};