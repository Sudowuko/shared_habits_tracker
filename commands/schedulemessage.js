const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedulemessage')
        .setDescription('Schedules a daily message for the competition'),
    execute: async (interaction) => {
        const { commands } = interaction.client;
        
        // Your daily message logic here
        const dailymessageCommand = commands.get('dailymessage');
        if (dailymessageCommand) {
            dailymessageCommand.execute(interaction);
        }
    },
};
