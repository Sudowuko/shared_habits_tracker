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
        .setName('remove')
        .setDescription('removes user tokens')
        .addStringOption(option =>
            option.setName('tokens')
                .setDescription('Amount of tokens to remove')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id);
        const doc = await docRef.get();
        const tokens_removed = parseInt(interaction.options.getString('tokens'));

        await docRef.update({
            "tokens": admin.firestore.FieldValue.increment(-tokens_removed)
        });


        const previous_tokens = doc.get('tokens');

        interaction.reply(tokens_removed + " tokens removed. " + user.username + " now has " + (previous_tokens - tokens_removed)  + " tokens.");
    }
};
