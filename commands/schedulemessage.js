//OUTDATED COMMAND WILL DELETE SOON
const { SlashCommandBuilder } = require('@discordjs/builders');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedulemessage')
        .setDescription('Schedules a daily message for the competition'),
    async execute(interaction) {
        // Schedule the dailymessage logic to run at 5:50 PM
        const scheduledTime = new Date();
        scheduledTime.setHours(17, 11, 0); // Set the desired time

        // Use node-schedule to execute the dailymessage logic
        schedule.scheduleJob(scheduledTime, () => {
            // Your daily message logic here (call dailymessage or include its logic here)
            const dailymessageCommand = interaction.client.commands.get('dailymessage');
            if (dailymessageCommand) {
                dailymessageCommand.execute(interaction);
            }
        });

       // interaction.reply('Daily message has been scheduled at 5:50 PM.');
    },
};
