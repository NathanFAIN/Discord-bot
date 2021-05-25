import { Client as Bot } from 'discord.js'
import { config as env } from 'dotenv'
import fs from 'fs'

env()

export const init = () => {
	// Discord
	const client = new Bot()

	client.login(process.env.DISCORD_TOKEN)

	client.on('ready', () => {
		client.user.setActivity('!help', { type: 'LISTENING' })

		console.log(`Logged in as ${client.user.tag}!`)
	})

	// FS
	let data = {}
	try {
		if (fs.existsSync(process.env.DATA_FOLDER)) {
			fs.readFile(process.env.DATA_FOLDER, (err, res) => {
				if (err) throw err

				data = JSON.parse(res)
			})
		}
	} catch (err) {
		throw err
	}

	// Resolve
	return { client, data }
}

export const save = res => {
	fs.writeFile(process.env.DATA_FOLDER, res, err => {
		if (err) throw err
	})
}
