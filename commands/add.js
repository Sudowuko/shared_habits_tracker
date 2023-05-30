const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
    admin.initializeApp();
}

//const db = getFirestore()
const db = admin.firestore();

module.exports = {

    data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('adds user tokens')
    .addStringOption(option =>
        option.setName('tokens')
        .setDescription('Amount of tokens to add')
        .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const docRef = db.collection('users').doc(user.id.toString());
        const doc = await docRef.get();
        const tokens_added = parseInt(interaction.options.getString('tokens')) 
        docRef.update({
            "tokens": admin.firestore.FieldValue.increment(tokens_added)
        })
        const previous_tokens = doc.get('tokens');

        interaction.reply(tokens_added + " tokens added. " + user.username + " now has " + (tokens_added + previous_tokens) + " tokens");
    }
}

