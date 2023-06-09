const { SlashCommandBuilder } = require('@discordjs/builders');

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
        // Shuffling function
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        let membercount = 0;
        const userRef = db.collection('users');
        const userDocs = await userRef.get();
        const userArray = userDocs.docs.map((doc) => doc);
        const usernames = [];

        userDocs.forEach((userDoc) => {
            const registered = userDoc.data().registered;
            const username = userDoc.data().username;

            if (registered === true) {
                usernames.push(username);
                membercount += 1;
            }
        });

        // Shuffle the userDocs array
        const shuffledUserDocs = shuffleArray(userArray);

        // Get team information
        const teamsRef = db.collection('teams');
        const teamInfo = await teamsRef.get();
        const teamCount = teamInfo.size;

        //Get number of people needed per team
        const membersPerTeam = Math.floor(membercount / teamCount);

        //Reset teams before sorting members
        teamInfo.forEach((teamDoc) => {
            const teamRef = teamsRef.doc(teamDoc.id);
            teamRef.update({
                member_list: [] 
            });
        });

        //Sort members into teams collection
        let currentTeamIndex = 0;
        let currentMembers = 0;
        shuffledUserDocs.forEach((userDoc) => {
            const userID = userDoc.id;
            const registered = userDoc.data().registered;

            if (registered === true) {
                const teamDocs = teamInfo.docs;
                if (currentTeamIndex < teamDocs.length) {
                    const teamRef = teamsRef.doc(teamDocs[currentTeamIndex].id);
                    const teamName = teamDocs[currentTeamIndex].data().team_name;

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

        await interaction.reply(`Teams have been organized`);

        return
    },
};
