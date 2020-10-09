import * as Prims from './primitives';

const deserializeToonMemeBotServer = json => {
	const archive = new Prims.Archive();

	const server = new Prims.Server();

	// server.id = null; // unsaved
	// server.name = null; // unsaved
	// server.iconURL = null; // unsaved

	// Parse members
	const serverMembers = server.members;
	const archiveUsers = archive.users;
	for (const member of json.members) {
		const parsedMember = new Prims.Member();

		parsedMember.id = member.user.id;
		parsedMember.nickname = member.nickname; // explicitly null in serialized format if unset
		Object.freeze(parsedMember);

		serverMembers.set(parsedMember.id, parsedMember);

		// perhaps store users somewhere else?
		const parsedUser = new Prims.User();

		parsedUser.id = member.user.id;
		// parsedUser.avatarURL = null; // unsaved
		parsedUser.username = member.user.username;
		parsedUser.discriminator = member.user.discriminator;
		Object.freeze(parsedUser);

		archiveUsers.set(parsedUser.id, parsedUser);
	}

	// Parse emojis
	const serverEmojis = server.emojis;
	for (const emoji of json.emojis) {
		const parsedEmoji = new Prims.Emoji();

		parsedEmoji.id = emoji.id;
		parsedEmoji.name = emoji.name;
		parsedEmoji.url = emoji.url; // explicitly null in serialized format if unset

		Object.freeze(parsedEmoji);
		serverEmojis.set(parsedEmoji.id, parsedEmoji);
	}

	// Parse channels
	const serverChannels = server.channels;
	for (const channel of json.channels) {
		const parsedChannel = new Prims.Channel();

		parsedChannel.id = channel.id;
		parsedChannel.name = channel.name;
		parsedChannel.nsfw = false; // unsaved
		parsedChannel.topic = channel.topic;
		parsedChannel.position = channel.position;
		parsedChannel.type = 'text'; // ToonMemeBot only saves text channels

		const channelMessages = parsedChannel.messages;
		// possible tight loop?
		for (let i = 0; i < channel.messages.length; i++) {
			const message = channel.messages[i];

			const parsedMessage = new Prims.Message();

			parsedMessage.id = message.id;
			parsedMessage.authorID = message.author;
			parsedMessage.content = message.content;
			parsedMessage.createdTimestamp = message.createdTimestamp;
			parsedMessage.editedTimestamp = message.editedTimestamp; // explicitly null in serialized format if unset
			parsedMessage.type = 'DEFAULT'; // unsaved

			if (message.attachments.length > 0) {
				for (const attachment of message.attachments) {
					const parsedAttachment = new Prims.Attachment();

					parsedAttachment.id = attachment.id;
					parsedAttachment.name = attachment.filename;
					parsedAttachment.size = attachment.filesize;
					parsedAttachment.url = attachment.url;

					parsedMessage.attachments.push(parsedAttachment);
				}
			}

			Object.freeze(parsedMessage);
			channelMessages.push(parsedMessage);
		}

		// Only reverse the messsages if they're in reverse order
		// This is needed for one specific archive I created with a faulty conversion tool
		if (channelMessages.length > 1 &&
			channelMessages[1].createdTimestamp < channelMessages[0].createdTimestamp) {
			channelMessages.reverse();
		}

		Object.freeze(channelMessages);
		Object.freeze(parsedChannel);
		archive.channels.set(parsedChannel.id, parsedChannel);
		serverChannels.add(parsedChannel.id);
	}

	archive.type = 'server';
	archive.data = server;

	return archive;
};

export default deserializeToonMemeBotServer;
