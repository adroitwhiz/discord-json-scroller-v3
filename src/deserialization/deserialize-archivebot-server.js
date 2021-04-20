import * as Prims from './primitives';

const deserializeArchiveBotServer = json => {
	const archive = new Prims.Archive();

	const server = new Prims.Server();

	server.id = json.id;
	server.name = json.name;
	server.iconURL = json.iconURL;

	const archiveVersion = json.version ? parseInt(json.version.replace('archivebot-v', '')) : 1;

	// Parse roles
	const serverRoles = server.roles;
	for (const role of json.roles) {
		const parsedRole = new Prims.Role();

		parsedRole.id = role.id;
		parsedRole.name = role.name;
		parsedRole.color = role.color;
		parsedRole.permissions = role.permissions;
		parsedRole.position = role.position;
		parsedRole.hoist = Object.prototype.hasOwnProperty.call(role, 'hoist') ? role.hoist : true;

		Object.freeze(parsedRole);
		serverRoles.set(parsedRole.id, parsedRole);
	}

	// Parse users
	const archiveUsers = archive.users;

	const parseAndAddUser = user => {
		const parsedUser = new Prims.User();

		parsedUser.id = user.id;
		parsedUser.avatarURL = user.avatarURL;
		parsedUser.username = user.username;
		// Archives with a version < 3 do not save users' discriminators
		if (user.discriminator) {
			parsedUser.discriminator = user.discriminator;
		} else {
			parsedUser.discriminator = user.tag.slice(-4);
		}

		Object.freeze(parsedUser);
		archiveUsers.set(parsedUser.id, parsedUser);
	};

	if (archiveVersion >= 6) {
		for (const user of json.users) {
			parseAndAddUser(user);
		}
	}

	// Parse members
	const serverMembers = server.members;
	for (const member of json.members) {
		const parsedMember = new Prims.Member();

		parsedMember.id = member.id;
		parsedMember.nickname = member.nickname; // explicitly null in serialized format if unset

		// V3 onwards stores role IDs; earlier versions store roles
		if (archiveVersion < 3) {
			for (const role of member.roles) {
				parsedMember.roles.push(serverRoles.get(role.id));
			}
		} else {
			for (const roleID of member.roles) {
				parsedMember.roles.push(serverRoles.get(roleID));
			}
		}

		parsedMember.roles.sort((a, b) => b.position - a.position);

		if (archiveVersion < 6) {
			parseAndAddUser(member.user);
		}

		Object.freeze(parsedMember);
		serverMembers.set(parsedMember.id, parsedMember);
	}

	// Older archivebot versions treat offline users as not being members
	if (archiveVersion < 7) {
		let everyoneRole = null;
		for (const role of serverRoles.values()) {
			if (role.name === '@everyone') {
				everyoneRole = role;
				break;
			}
		}

		for (const user of archiveUsers.values()) {
			if (!serverMembers.has(user.id)) {
				const fakeMember = new Prims.Member();
				fakeMember.id = user.id;
				fakeMember.nickname = null;
				fakeMember.roles.push(everyoneRole);
				serverMembers.set(user.id, fakeMember);
			}
		}
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
					parsedMessage.attachments = [];
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

				// Freezing each message slows things down considerably
				// Object.freeze(parsedMessage);
				channelMessages.push(parsedMessage);
			}

			Object.freeze(channelMessages);
		}

		Object.freeze(parsedChannel);
		serverChannels.add(parsedChannel.id);
		archive.channels.set(parsedChannel.id, parsedChannel);
	}

	archive.type = 'server';
	archive.data = server;

	return archive;
};

export default deserializeArchiveBotServer;
