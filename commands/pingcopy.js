const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

module.exports = {
    //Solve the commmand name issue, for some reason setting new commands with different names don't work

    data: new SlashCommandBuilder()
        .setName('pingcopy')
        .setDescription('view personal stats test')
        .addStringOption(option =>
            option.setName('tokens')
                .setDescription('The input to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('logs')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('team')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('habit')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('quests')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('streaks')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mvp')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('wins')
                .setDescription('The input1 to echo back')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('purchases')
                .setDescription('The input1 to echo back')
                .setRequired(true)),

    //Figure out how to use input parameters in this function
    async execute(interaction) {
        const user = interaction.user;
        //const docRef = db.collection('users').doc(user.id.toString());
        // const doc = await docRef.get();
        // doc.set({
        //     'tokens': token_count,
        //     'monthly_logs': int(monthly_log_count),
        //     'team': team_name,
        //     'habit': habit_name,
        //     'quests': int(quest_count),
        //     'streaks': int(streak_count),
        //     'mvp': int(mvp_count),
        //     'wins': int(win_count),
        //     'purchases': int(purchase_count)
        // })
        interaction.reply("Personal Stats for  + user.username" + { option });
    }
}