import * as Prims from './primitives';

const deserializeChannel = channel => {
	const parsedChannel = new Prims.Channel();

	parsedChannel.id = channel.id;
	parsedChannel.name = channel.name;
	parsedChannel.parentID = channel.parentID || null; // *not* explicitly null if unset
	parsedChannel.nsfw = channel.nsfw === true; // sometimes is null, so explicitly cast to boolean
	parsedChannel.topic = channel.topic;
	parsedChannel.position = channel.position;
	parsedChannel.type = channel.type;

	if (channel.hasOwnProperty('messages')) {
		const channelMessages = parsedChannel.messages;

		// possible tight loop?
		for (let i = 0; i < channel.messages.length; i++) {
			const message = channel.messages[i];

			const parsedMessage = new Prims.Message();

			parsedMessage.id = message.id;
			parsedMessage.authorID = message.author;
			parsedMessage.content = message.content;
			parsedMessage.createdTimestamp = message.createdTimestamp;
			parsedMessage.editedTimestamp = message.editedTimestamp || null;
			parsedMessage.type = message.type || 'DEFAULT'; // if DEFAULT, not explicitly set to save space

			if (message.hasOwnProperty('attachments') && message.attachments.length > 0) {
				for (const attachment of message.attachments) {
					const parsedAttachment = new Prims.Attachment();

					parsedAttachment.id = attachment.id;
					parsedAttachment.name = attachment.name;
					parsedAttachment.size = attachment.size;
					parsedAttachment.url = attachment.url;

					if (attachment.hasOwnProperty('width')) parsedAttachment.width = attachment.width;
					if (attachment.hasOwnProperty('height')) parsedAttachment.height = attachment.height;

					parsedMessage.attachments.push(parsedAttachment);
				}
			}

			channelMessages.push(parsedMessage);
		}
	}

	return parsedChannel;
};

const deserializeServer = (server, archive) => {
	const parsedServer = new Prims.Server();

	// Parse roles
	const serverRoles = parsedServer.roles;
	for (const role of server.roles) {
		const parsedRole = new Prims.Role();

		parsedRole.id = role.id;
		parsedRole.name = role.name;
		parsedRole.color = role.color;
		parsedRole.permissions = role.permissions;
		parsedRole.position = role.position;
		parsedRole.hoist = role.hoist;

		serverRoles.set(parsedRole.id, parsedRole);
	}

	// Parse members
	const serverMembers = parsedServer.members;
	for (const member of server.members) {
		const parsedMember = new Prims.Member();

		parsedMember.id = member.id;
		parsedMember.nickname = member.nickname; // explicitly null in serialized format if unset

		for (const roleID of member.roles) {
			parsedMember.roles.push(serverRoles.get(roleID));
		}

		serverMembers.set(parsedMember.id, parsedMember);
	}

	// Parse emojis
	const serverEmojis = parsedServer.emojis;
	for (const emoji of server.emojis) {
		const parsedEmoji = new Prims.Emoji();

		parsedEmoji.id = emoji.id;
		parsedEmoji.name = emoji.name;
		parsedEmoji.url = emoji.url; // explicitly null in serialized format if unset

		Object.freeze(parsedEmoji);
		serverEmojis.set(parsedEmoji.id, parsedEmoji);
	}

	// Parse channels
	const serverChannels = parsedServer.channels;
	for (const channel of server.channels) {
		const parsedChannel = deserializeChannel(channel);
		archive.channels.set(parsedChannel.id, parsedChannel);
		serverChannels.add(parsedChannel.id);
	}

	return parsedServer;
};

const deserializeArchiveBotArchive = json => {
	const archive = new Prims.Archive();

	archive.type = json.archiveType;

	for (const user of json.users) {
		const parsedUser = new Prims.User();

		parsedUser.id = user.id;
		parsedUser.username = user.username;
		parsedUser.avatarURL = user.avatarURL;
		parsedUser.discriminator = user.discriminator;

		archive.users.set(user.id, parsedUser);
	}

	switch (archive.type) {
		case 'server': {
			archive.data = deserializeServer(json.archiveData, archive);
			break;
		}
		case 'channel': {
			archive.data = deserializeChannel(json.archiveData);
			archive.channels.set(archive.data.id, archive.data);
			break;
		}
	}

	return archive;
};

export default deserializeArchiveBotArchive;
