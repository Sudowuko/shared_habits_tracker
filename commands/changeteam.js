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
        .setName('changeteam')
        .setDescription('changes current team')
        .addStringOption(option =>
            option.setName('team')
                .setDescription('set team name')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id);
        const changed_team = (interaction.options.getString('team'));

        await docRef.update({
            "team": changed_team
        });

        const updated_doc = await docRef.get();
        const updated_team = updated_doc.data().team;


        interaction.reply(user.username + "'s team has been switched to " + updated_team);
    }
};
