require('dotenv').config()
const fs = require('fs')
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
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
    }
}
