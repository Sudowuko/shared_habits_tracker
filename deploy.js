require('dotenv').config()
const fs = require('fs')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const cron = require('node-cron'); // Import node-cron


module.exports = {
    deployCommands: (client) => {
        commands = []
        client.commands = new Collection()

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`)
            
            commandObj = command.data.toJSON()
            commands.push(commandObj)
            client.commands.set(commandObj.name, command)
          //  console.log("Command Name: " + commandObj.name);
        }

        // Schedule the daily command at a specific time (e.g., 5:00 PM)
        // cron.schedule('30 17 * * *', () => {
        //     const dailyMessageCommand = require(`./commands/dailymessage`)

        //         // Your daily command logic here
        //    // const dailyMessageCommand = client.commands.get('dailymessage');
        //     if (dailyMessageCommand) {
        //             // Replace 'interaction' with an appropriate context (or pass null if not needed)
        //         dailyMessageCommand.execute(null);
        //     }
        // });

        const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
        rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands})
    }
}
