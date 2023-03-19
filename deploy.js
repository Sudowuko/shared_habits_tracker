require('dotenv').config()
const fs = require('fs')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

module.exports = {
    deployCommands: (client) => {
        commands = []
        client.commands = new Collection()

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`)
            commandObj = command.data.toJSON()
            commands.push(commandObj)
            client.commands.set(commandObj.name, command)
        }
        const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
        rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands})
    }
}
