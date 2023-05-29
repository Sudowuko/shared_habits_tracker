const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

module.exports = {

    data: new SlashCommandBuilder().setName('stats').setDescription('view personal stats'),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());
        const doc = await docRef.get();
        const tokens = doc.get('tokens');
        const monthlyLogs = doc.get('monthly_logs');
        const team = doc.get('team');
        const habit = doc.get('habit');
        const wins = doc.get('wins')
        interaction.reply("```md\n#Stats -> " + user.username +
            "\nTokens: " + tokens +
            "\nHabit: " + habit +
            "\nTeam: " + team +
            "\nWins: " + wins +
            "\nMonthly Logs: " + monthlyLogs +
            "\n```");
    }
}