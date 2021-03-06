const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['u'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_UNLOAD_DESCRIPTION'),
			usage: '<Piece:piece>',
			runIn: ['text', 'dm']
		});
	}

	async run(message, [piece]) {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return message.sendLocale('COMMAND_UNLOAD_WARN');
		}

		piece.unload();

		return message.sendLocale('COMMAND_UNLOAD', [piece.type, piece.name]);
	}
};
