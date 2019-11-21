import * as Prims from './primitives';

const deserializeArchiveBot = json => {
	const server = new Prims.Server();

	server.id = json.id;
	server.name = json.name;
	server.iconURL = json.iconURL;

	// Parse roles
	const serverRoles = server.roles;
	for (const role of json.roles) {
		const parsedRole = new Prims.Role();

		parsedRole.id = role.id;
		parsedRole.name = role.name;
		parsedRole.color = role.color;
		parsedRole.permissions = role.permissions;
		parsedRole.position = role.position;

		Object.freeze(parsedRole);
		serverRoles.set(parsedRole.id, parsedRole);
	}

	// Parse members
	const serverMembers = server.members;
	for (const member of json.members) {
		const parsedMember = new Prims.Member();

		parsedMember.id = member.id;
		parsedMember.nickname = member.nickname; // explicitly null in serialized format if unset

		// V3 onwards stores role IDs; earlier versions store roles
		if (json.version === 'archivebot-v1' || json.version === 'archivebot-v2') {
			for (const role of member.roles) {
				parsedMember.roles.push(serverRoles.get(role.id));
			}
		} else {
			for (const roleID of member.roles) {
				parsedMember.roles.push(serverRoles.get(roleID));
			}
		}

		// perhaps store users somewhere else?
		const parsedUser = new Prims.User();

		parsedUser.id = member.user.id;
		parsedUser.avatarURL = member.user.avatarURL;
		parsedUser.username = member.user.username;
		parsedUser.tag = member.user.tag;

		parsedMember.user = parsedUser;

		Object.freeze(parsedUser);
		Object.freeze(parsedMember);
		serverMembers.set(parsedMember.id, parsedMember);
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
		parsedChannel.name = channel.name || channel.id; // Earlier versions of ArchiveBot do not save channel names
		parsedChannel.parentID = channel.parentID || null; // *not* explicitly null if unset
		parsedChannel.nsfw = channel.nsfw === true; // sometimes is null, so explicitly cast to boolean
		parsedChannel.topic = channel.topic;
		parsedChannel.position = channel.position;
		parsedChannel.type = channel.type;

		if (channel.type === 'text') {
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

						parsedMessage.attachments.push(parsedAttachment);
					}
				}

				Object.freeze(parsedMessage);
				channelMessages.push(parsedMessage);
			}

			Object.freeze(channelMessages);
		}

		Object.freeze(parsedChannel);
		serverChannels.set(parsedChannel.id, parsedChannel);
	}

	return server;
};

export default deserializeArchiveBot;
