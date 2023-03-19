const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

async function firestoreTest() {
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    })
}

// async def viewStats(ctx, arg=None):
//     user = ctx.author
//     doc_ref = db.collection('users').document(str(user.id))
//     tokens = doc_ref.get().get("tokens")
//     monthly_logs = doc_ref.get().get("monthly_logs")
//     team = doc_ref.get().get("team")
//     habit = doc_ref.get().get("habit")
//     await ctx.send(f"**Personal Stats for {ctx.author}** \n ```Tokens: {tokens} \nMonthly Logs: {monthly_logs} \nTeam: {team} \nHabit: {habit}``` ")

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
        //     await ctx.send(f"**Personal Stats for {ctx.author}** \n ```Tokens: {tokens} \nMonthly Logs: {monthly_logs} \nTeam: {team} \nHabit: {habit}``` ")

        // console.log("User: ", user)
        // console.log("Interaction: ", interaction);
        interaction.reply(`**Personal Stats for ${user.username}** \n Tokens: ${tokens} \nMonthly Logs: ${monthlyLogs} \nTeam: ${team} \nHabit: ${habit}`);
    }
}