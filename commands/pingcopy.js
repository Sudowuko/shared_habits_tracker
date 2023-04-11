const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

module.exports = {
    //Figure out how to add paramterization options for this slash command
    //Solve the commmand name issue, for some reason setting new commands with different names don't work
    data: new SlashCommandBuilder().setName('pingcopy').setDescription('set stats for user'),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());
        const doc = await docRef.get();
        doc.set({
            'tokens': token_count,
            'monthly_logs': int(monthly_log_count),
            'team': team_name,
            'habit': habit_name,
            'quests': int(quest_count),
            'streaks': int(streak_count),
            'mvp': int(mvp_count),
            'wins': int(win_count),
            'purchases': int(purchase_count)
        })
        interaction.reply("Personal Stats for  + user.username");
    }
}