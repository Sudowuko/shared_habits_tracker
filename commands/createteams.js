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
        .setName('createteams')
        .setDescription('creates a new number of teams')
        .addStringOption(option =>
            option.setName('team_count')
                .setDescription('Amount of teams needed to add')
                .setRequired(true)),
    async execute(interaction) {
        const teamsRef = db.collection('teams');
        const emojis = {
            A: "🇦",
            B: "🇧",
            C: "🇨",
            D: "🇩",
            E: "🇪",
            F: "🇫",
            G: "🇬",
            H: "🇭"
        };
        const team_count = parseInt(interaction.options.getString('team_count'));
        const createdTeams = [];
        for (let team_num = 0; team_num < team_count; team_num++) {
            const team_letter = String.fromCharCode(64 + (team_num + 1));
            const teamRef = teamsRef.doc(team_letter);
            await teamRef.set({
                team_name: "team_" + team_letter,
                emote: emojis[team_letter],
                points: 0,
                member_list: [],
            });
            const team_name = (await teamRef.get()).data().team_name;
            createdTeams.push(team_name);
        }
        await interaction.reply(`Created teams:\n${createdTeams.join('\n')}`);
    }
};
