const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

async function firestoreTest () {
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    })
}
module.exports = {

    data: new SlashCommandBuilder().setName('add').setDescription('adds user tokens'),
    async execute(interaction) {
        firestoreTest();
        interaction.reply("third command works! :D");
    }
}