import * as Prims from './primitives';

const deserializeToonMemeBotChannel = json => {
	const archive = new Prims.Archive();

	// Dummy channel
	const channel = new Prims.Channel();
	channel.id = 0;
	channel.name = '<only channel>';
	channel.nsfw = false;
	channel.position = 0;
	channel.type = 'text';

	const channelMessages = channel.messages;
	for (const message of json) {
		const jsonMessage = JSON.parse(message);

		const parsedMessage = new Prims.Message();

		parsedMessage.id = jsonMessage.id;
		parsedMessage.authorID = jsonMessage.user.id;
		parsedMessage.content = jsonMessage.content;
		parsedMessage.createdTimestamp = jsonMessage.createdTimestamp;
		parsedMessage.editedTimestamp = jsonMessage.editedTimestamp; // explicitly null in serialized format if unset
		parsedMessage.type = 'DEFAULT'; // unsaved

		if (jsonMessage.attachments.length > 0) {
			for (const attachment of jsonMessage.attachments) {
				const parsedAttachment = new Prims.Attachment();

				parsedAttachment.id = attachment.id;
				parsedAttachment.name = attachment.filename;
				parsedAttachment.size = attachment.filesize;
				parsedAttachment.url = attachment.url;

				parsedMessage.attachments.push(parsedAttachment);
			}
		}

		// Single-channel archives do not contain member lists
		if (!archive.users.has(jsonMessage.user.id)) {
			const parsedUser = new Prims.User();

			parsedUser.id = jsonMessage.user.id;
			parsedUser.username = jsonMessage.user.username;
			parsedUser.discriminator = jsonMessage.user.discriminator;
			Object.freeze(parsedUser);

			archive.users.set(parsedUser.id, parsedUser);
		}

		Object.freeze(parsedMessage);
		channelMessages.push(parsedMessage);
	}
	Object.freeze(channelMessages);

	archive.type = 'channel';
	archive.data = channel;
	archive.channels.set(channel.id, channel);

	return archive;
};

export default deserializeToonMemeBotChannel;
