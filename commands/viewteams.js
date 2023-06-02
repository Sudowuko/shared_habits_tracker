const { SlashCommandBuilder } = require('@discordjs/builders');

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not done already
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewteams')
        .setDescription('View the current team layout'),
    async execute(interaction) {
       
        // Get team information
        const teamRef = db.collection('teams');
        const teamDocs = await teamRef.get();

        //Get user information
        const userRef = db.collection('users');
        const userDocs = await userRef.get();
  
        //Display team members
        let outputMessage = '';
        console.log("Teams Sort Being Displayed");
        teamDocs.forEach((teamDoc) => {
            const teamName = teamDoc.get('team_name');
            const members = teamDoc.get('member_list');
            console.log("Team Name: " + teamName);
            console.log("Members List: " + members);
            const memberNames = [];
            outputMessage += `${teamName}\n`;
            members.forEach((member) => {
                const userDoc = userDocs.docs.find((doc) => doc.id === member);
                const username = userDoc.data().username;
                memberNames.push(username);
            });
            memberNames.forEach((username) => {
                outputMessage += `- ${username}\n`;
            });
            outputMessage += '\n';
        });
        if (outputMessage === '') {
            outputMessage = 'No team information found.';
        }

        await interaction.reply(`Here are the current teams:\n\n${outputMessage}`);

        return
    },
};

