const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function handleCommandInteraction(interaction) {
    const { commandName } = interaction;
    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'buttons') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Team A')
                    .setLabel('Team A')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Team B')
                    .setLabel('Team B')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Team C')
                    .setLabel('Team C')
                    .setStyle(ButtonStyle.Primary),
            );
        const messageContent = 'Test Message';
        await interaction.reply({ content: messageContent, components: [row] });
    }
}

async function handleButtonInteraction(interaction) {
    const buttonId = interaction.customId;
    console.log(`Button clicked: ${buttonId}`);
    await interaction.reply(`Button clicked: ${buttonId}`);
}

module.exports = { handleCommandInteraction, handleButtonInteraction };
