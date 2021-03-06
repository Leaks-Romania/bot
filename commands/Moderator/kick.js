const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			requiredPermissions: ['KICK_MEMBERS'],
			runIn: ['text'],
			requiredSettings: ['channels.modlog'],
			description: 'Kicks a mentioned user.',
			usage: '<User:user> [Reason:...string]',
			usageDelim: ' '
		});
	}

	async run(message, [user, reason]) {
		const member = await message.guild.members.fetch(user).catch(() => null);

		if (!member) {
			throw `${message.author}, this user is no longer on the server.`;
		}

		if (member.id === message.author.id) {
			throw 'Why would you kick yourself?';
		}

		if (member.id === this.client.user.id) {
			throw 'Have I done something wrong?';
		}

		if (member.roles.highest.position >= message.member.roles.highest.position) {
			throw 'You cannot kick this user.';
		}

		if (!member.kickable) {
			throw 'I cannot kick this user.';
		}

		await member.kick(reason);

		if (message.guild.settings.channels.modlog) {
			const log = new ModLog(message.guild);

			log.type = 'kick';
			log.moderator = message.author;
			log.user = user;
			log.reason = reason;
			log.send();
		}

		return message.sendEmbed(
			new MessageEmbed()
				.setColor('#43b581')
				.setDescription(
					`<:valet_yeah:716348838289342496> **${message.author.tag}** kicked **${member.user.tag}**, reason: ${
						reason || 'No reason.'
					}`
				)
		);
	}
};
