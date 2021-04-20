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
	let pinnedMessageIDs;
	const hasPinnedMessages = 'pinnedMessages' in channel;
	if (hasPinnedMessages) {
		parsedChannel.pinnedMessages = [];
		pinnedMessageIDs = new Set();
		for (const pinnedMessageID of channel.pinnedMessages) {
			pinnedMessageIDs.add(pinnedMessageID);
		}
	}

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

			if (message.hasOwnProperty('reactions') && message.reactions.length > 0) {
				parsedMessage.reactions = [];
				for (const reaction of message.reactions) {
					const parsedReaction = new Prims.MessageReaction();

					parsedReaction.count = reaction.count;
					parsedReaction.emoji = reaction.emoji;
					parsedReaction.emojiIsCustom = reaction.emojiIsCustom;
					if (reaction.hasOwnProperty('users')) parsedReaction.users = reaction.users;
					parsedMessage.reactions.push(parsedReaction);
				}
			}

			if (hasPinnedMessages && pinnedMessageIDs.has(message.id)) {
				parsedChannel.pinnedMessages.push(parsedMessage);
			}

			channelMessages.push(parsedMessage);
		}
	}

	if (channel.type === 'group') {
		parsedChannel.recipients = channel.recipients;
	}

	return parsedChannel;
};

const deserializeServer = (server, archive, archiveVersion) => {
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
		parsedMember.joinedTimestamp = member.joinedTimestamp; // explicitly null in serialized format if unset

		for (const roleID of member.roles) {
			parsedMember.roles.push(serverRoles.get(roleID));
		}

		parsedMember.roles.sort((a, b) => b.position - a.position);

		serverMembers.set(parsedMember.id, parsedMember);
	}

	// Parse emojis
	const serverEmojis = parsedServer.emojis;
	if (archiveVersion < 11) {
		for (const emoji of server.emojis) {
			const parsedEmoji = new Prims.CustomEmoji();
	
			parsedEmoji.id = emoji.id;
			parsedEmoji.name = emoji.name;
			parsedEmoji.url = emoji.url || `https://cdn.discordapp.com/emojis/${emoji.id}`;
	
			serverEmojis.set(parsedEmoji.id, parsedEmoji);
			archive.emojis.set(parsedEmoji.id, parsedEmoji);
		}
	} else {
		for (const emojiID of server.emojis) {
			serverEmojis.set(emojiID, archive.emojis.get(emojiID));
		}
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

const deserializeArchiveBotArchive = async (json, zip) => {
	const archiveVersion = json.version ? parseInt(json.version.replace('archivebot-v', '')) : 1;

	const archive = new Prims.Archive();
	window.archive = archive;

	archive.type = json.archiveType;

	for (const user of json.users) {
		const parsedUser = new Prims.User();

		parsedUser.id = user.id;
		parsedUser.username = user.username;
		parsedUser.avatarURL = user.avatarURL;
		parsedUser.discriminator = user.discriminator;

		archive.users.set(user.id, parsedUser);
	}

	if (archiveVersion >= 11) {
		for (const emoji of json.emojis) {
			const parsedEmoji = new Prims.CustomEmoji();
	
			parsedEmoji.animated = emoji.animated;
			parsedEmoji.createdTimestamp = emoji.createdTimestamp;
			parsedEmoji.guild = emoji.guild; // explicitly null in serialized format if unset
			parsedEmoji.id = emoji.id;
			parsedEmoji.identifier = emoji.identifier;
			parsedEmoji.name = emoji.name;
			parsedEmoji.url = emoji.url || `https://cdn.discordapp.com/emojis/${emoji.id}`;

			archive.emojis.set(emoji.id, parsedEmoji);
		}
	}

	switch (archive.type) {
		case 'server': {
			archive.data = deserializeServer(json.archiveData, archive, archiveVersion);
			break;
		}
		case 'channel': {
			archive.data = deserializeChannel(json.archiveData);
			archive.channels.set(archive.data.id, archive.data);
			break;
		}
	}

	if (zip) {
		const {entries} = zip;
		// Currently, an avatars folder is created even if no avatars are saved, so it's okay to only check for it.
		if (Object.prototype.hasOwnProperty.call(entries, 'avatars/')) {
			const filePromises = [];
			for (const path of Object.keys(entries)) {
				// regex matches the first folder in the path (it must be a folder because it's followed by a slash),
				// and the filename after it
				const pathMatch = /^([^/]+)\/(.+)$/.exec(path);
				if (!pathMatch) continue;
				const [__, leadingFolder, filePath] = pathMatch;

				if (leadingFolder !== 'avatars' && leadingFolder !== 'emojis') continue;

				const entry = entries[path];
				if (entry.isDirectory) continue;
				filePromises.push(entry.blob().then(blob => {
					const blobURL = URL.createObjectURL(blob);
					switch (leadingFolder) {
						case 'avatars':
							archive.avatars.set(filePath, blobURL);
							break;
						case 'emojis':
							archive.emojiURLs.set(filePath, blobURL);
							break;
					}
					
				}));
			}
			await Promise.all(filePromises);
		}
	}

	return archive;
};

export default deserializeArchiveBotArchive;
