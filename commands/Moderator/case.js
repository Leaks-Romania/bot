const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const ModLog = require('../../utils/modlog');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			permissionLevel: 6,
			runIn: ['text'],
			description: 'Check a moderation case log for the specified case number.',
			usage: '<Case:integer>'
		});
	}

	async run(message, [casenum]) {
		const log = message.guild.settings.modlogs[casenum];

		if (!log) {
			throw `${message.author}, there is no modlog under that case.`;
		}

		const [user, moderator] = await Promise.all([this.client.users.fetch(log.user), this.client.users.fetch(log.moderator)]);

		return message.sendEmbed(
			new MessageEmbed()
				.setAuthor(
					`[${log.type.toUpperCase()}] ${user.tag} (${user.id})`,
					user.avatarURL({ dynamic: true, size: 2048, format: 'png' })
				)
				.setColor(ModLog.colour(log.type))
				.setDescription([
					`**Moderator:** ${moderator.tag} (${moderator.id})`,
					`**Reason:** ${log.reason || `No reason specified, write \`reason ${log.case}\` to claim this log.`}`
				])
				.setFooter(`Case #${log.case}`)
				.setTimestamp()
		);
	}
};
