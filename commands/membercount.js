const { SlashCommandBuilder } = require('@discordjs/builders');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore()

module.exports = {

    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('view registered members'),
  
async execute (interaction) {
    let count = 0;
    const userRef = db.collection('users');
    const docs = await userRef.get();
    
    docs.forEach((doc) => {
      const registered = doc.data().registered;
      if (registered === true) {
        count += 1;
      }
    });
  
    interaction.reply(`member count is ${count}`);
    return count;
  }
}