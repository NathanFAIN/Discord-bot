const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
var data = {}
var n = 1;
var lastMessageId = 0;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Ta mere', { type: 'CUSTOM_STATUS', name: 'Type !help'});

    if(fs.existsSync('save.json')) {
        fs.readFile('save.json', function (err, json_string) {
            if (err) throw err; 
            data = JSON.parse(json_string);
        });
    }
});

client.on('disconnect', () => {
});

client.on('message', message => {
    if (message.member && message.member.user && lastMessageId != message.member.user.id) {
        if (data[message.member.user.id]) {
            data[message.member.user.id] += 1;
        } else {
            data[message.member.user.id] = 1;
        }
        if (data[message.member.user.id] == 150) {
            var role = message.guild.roles.cache.find(role => role.name === "Noble");
            message.member.roles.add(role);
        } else if (data[message.member.user.id] == 475) {
            var role = message.guild.roles.cache.find(role => role.name === "Haut(e) Noble");
            message.member.roles.add(role);
        } else if (data[message.member.user.id] == 750) {
            var role = message.guild.roles.cache.find(role => role.name === "Conseiller(ère)");
            message.member.roles.add(role);
        } else if (data[message.member.user.id] == 2000) {
            var role = message.guild.roles.cache.find(role => role.name === "Roi");
            message.member.roles.add(role);
        }
        lastMessageId = message.member.user.id;
        var json_string = JSON.stringify(data);
        fs.writeFile('save.json', json_string, (err) => { 
            if (err) throw err; 
        })
    }
    if (message.content.startsWith('?kick') && message.member.hasPermission("ADMINISTRATOR")) {
        var member = message.mentions.members.first();
        if (member) {
            member.kick()({
                reason: 'They were bad!',
            }).then((member) => {
                message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
            }).catch(err => {
                message.reply(err);
            });
        } else {
            message.channel.send("USAGE: `?kick <user>`");
        }
    } else if (message.content.startsWith('?ban') && message.member.hasPermission("ADMINISTRATOR")) {
        var member = message.mentions.members.first();
        if (member) {
            member.ban()({
                reason: 'They were bad!',
            }).then((member) => {
                message.channel.send(":wave: " + member.displayName + " has been successfully banned :point_right: ");
            }).catch(err => {
                message.reply(err);
            });
        } else {
            message.channel.send("USAGE: `?ban <user>`");
        }
    } else if (message.content.startsWith('?info')) {
        var pingMember = message.mentions.members.first();
        if (pingMember) {
            var number = 0;
            if (data[pingMember.user.id])
                number = data[pingMember.user.id];
            message.channel.send(pingMember.user.avatarURL() + '\nNombre de message envoyé: `' + number + '`');
        } else {
            var number = 0;
            if (data[message.member.user.id])
                number = data[message.member.user.id];
            message.channel.send(message.member.user.avatarURL() + '\nNombre de message envoyé: `' + number + '`');
        }
    } else if (message.content.startsWith('?setinfo') && message.member.hasPermission("ADMINISTRATOR")) {
        var pingMember = message.mentions.members.first();
        if (pingMember && message.content.split(" ").length == 3) {
            var number = parseInt(message.content.split(" ")[2]);
            data[pingMember.user.id] = number;
            message.channel.send('Nombre de message set à: `' + number + '`');
            var json_string = JSON.stringify(data);
            fs.writeFile('save.json', json_string, (err) => { 
                if (err) throw err; 
            })
        }
    }
});

client.login('TOKEN');