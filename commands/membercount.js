const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('View registered members'),

  async execute(interaction) {
    let count = 0;
    const userRef = db.collection('users');
    const docs = await userRef.get();
    const usernames = [];

    docs.forEach((doc) => {
      const registered = doc.data().registered;
      const username = doc.data().username;

      if (registered === true) {
        usernames.push(username);
        count += 1;
      }
    });

    const usernamesList = usernames.join(', \n');

   interaction.reply(`Registered Users:\n ${usernamesList}\n\nMember count: ${count}`);
   console.log("username list is: " + usernamesList) 
   return usernamesList;
  }
};
