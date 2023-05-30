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
        .setName('organizemembers')
        .setDescription('Organizes members into existing teams'),
    async execute(interaction) {
        //Get list of registered users
        let membercount = 0;
        const userRef = db.collection('users');
        const userDocs = await userRef.get();
        const usernames = [];

        userDocs.forEach((userDoc) => {
            const registered = userDoc.data().registered;
            const username = userDoc.data().username;

            if (registered === true) {
                usernames.push(username);
                membercount += 1;
            }
        });

        // Gets number of teams available
        const teamsRef = db.collection('teams');
        const teamInfo = await teamsRef.get();
        const teamCount = teamInfo.size;

        //Get number of people needed per team
        const membersPerTeam = Math.floor(membercount / teamCount);

        //Sort members into teams collection
        let currentTeamIndex = 0;
        let currentMembers = 0;

        userDocs.forEach((userDoc) => {
            const userID = userDoc.id;
            const registered = userDoc.data().registered;

            if (registered === true) {
                const teamDocs = teamInfo.docs;
                if (currentTeamIndex < teamDocs.length) {
                    const teamRef = teamsRef.doc(teamDocs[currentTeamIndex].id);
                    const teamName = teamDocs[currentTeamIndex].data().team_name;
                    console.log("User ID: " + userID)
                    console.log("Team Name: " + teamName)
                    console.log("Team index: " + currentTeamIndex)
                    console.log("Current Member Count: " + currentMembers)

                    teamRef.update({
                        member_list: admin.firestore.FieldValue.arrayUnion(userID),
                    });
                    db.collection('users').doc(userID).update({
                        team: teamName,
                    });

                    currentMembers++;
                    if (currentMembers === membersPerTeam) {
                        currentTeamIndex++;
                        currentMembers = 0;
                    }
                }
            }
        });




        //Using the teams collection, print out all the team names along with each member associated to it

        let outputMessage = '';
        const teamRef = await teamsRef.get();

        for (const team of teamRef.docs) {
            const teamName = team.get('team_name');
            const members = team.get('member_list');

            outputMessage += `Team: ${teamName}\n`;

            for (const member of members) {
                const userRef = db.collection('users').doc(member);
                const userSnapshot = await userRef.get();
                const userData = userSnapshot.data();
                const username = userData.username;

                outputMessage += `- ${username}\n`;
            }
            outputMessage += '\n';
        }

        if (outputMessage === '') {
            outputMessage = 'No team information found.';
        }

        await interaction.reply(`Team Information:\n\n${outputMessage}`);

        return
    },
};
