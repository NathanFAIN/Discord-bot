import { init, save } from './setup.js'

let lastMessageId = 0
const { client, data } = init()

client.on('message', message => {
	if (
		!message.member ||
		!message.member.user ||
		message.author.bot ||
		lastMessageId == message.member.user.id
	)
		return

	let requester = data[message.member.user.id]

	if (requester) data[message.member.user.id] += 1
	else data[message.member.user.id] = 1

	switch (requester) {
		case 150:
			message.member.roles.add(
				message.guild.roles.cache.find(role => role.name === 'Noble'),
			)
			break
		case 475:
			message.member.roles.add(
				message.guild.roles.cache.find(role => role.name === 'Haut(e) Noble'),
			)
			break
		case 750:
			message.member.roles.add(
				message.guild.roles.cache.find(role => role.name === 'Conseiller(ère)'),
			)
			break
		case 2000:
			message.member.roles.add(
				message.guild.roles.cache.find(role => role.name === 'Roi'),
			)
			break
	}

	lastMessageId = message.member.user.id
	save(JSON.stringify(data))

	if (!message.member.hasPermission('ADMINISTRATOR')) return

	switch (message.content.split(' ')[0]) {
		case '?kick':
			var member = message.mentions.members.first()

			if (member) {
				member
					.kick()({
						reason: 'They were bad!',
					})
					.then(member => {
						message.channel.send(
							':wave: ' +
								member.displayName +
								' has been successfully kicked :point_right: ',
						)
					})
					.catch(err => {
						message.reply(err)
					})
				return
			}

			message.channel.send('USAGE: `?kick <user>`')
			break
		case '?ban':
			var member = message.mentions.members.first()

			if (member) {
				member
					.ban()({
						reason: 'They were bad!',
					})
					.then(member => {
						message.channel.send(
							':wave: ' +
								member.displayName +
								' has been successfully banned :point_right: ',
						)
					})
					.catch(err => {
						message.reply(err)
					})
				return
			}

			message.channel.send('USAGE: `?ban <user>`')
			break

		case '?info':
			var pingMember = message.mentions.members.first()
			var number = 0

			if (pingMember) {
				if (data[pingMember.user.id]) number = data[pingMember.user.id]

				message.channel.send(
					pingMember.user.avatarURL() +
						'\nNombre de message envoyé: `' +
						number +
						'`',
				)

				return
			}

			if (data[message.member.user.id]) number = data[message.member.user.id]
			message.channel.send(
				message.member.user.avatarURL() +
					'\nNombre de message envoyé: `' +
					number +
					'`',
			)
			break

		case '?setinfo':
			var pingMember = message.mentions.members.first()
			var number = parseInt(message.content.split(' ')[2])

			if (pingMember && message.content.split(' ').length == 3) {
				data[pingMember.user.id] = number

				message.channel.send('Nombre de message set à: `' + number + '`')

				save(JSON.stringify(data))
			}
			break
	}
})
