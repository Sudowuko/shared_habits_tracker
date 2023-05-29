const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');


const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changehabit')
        .setDescription('changes current habit')
        .addStringOption(option =>
            option.setName('habit')
                .setDescription('New habit')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id);
        const new_habit = (interaction.options.getString('habit'));

        await docRef.update({
            "habit": new_habit
        });

        const updated_doc = await docRef.get();
        const updated_habit = updated_doc.data().habit;


        interaction.reply(user.username + "'s new habit has been set to " + updated_habit);
    }
};
