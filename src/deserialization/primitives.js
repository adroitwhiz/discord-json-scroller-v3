class Archive {
	constructor () {
		/**
		 * The archive type (server or channel).
		 * @type {string}
		 */
		this.type = null;

		/**
		 * Map of all users encountered during archiving, keyed by ID.
		 * @type {Map<Snowflake, User>}
		 */
		this.users = new Map();

		/**
		 * Map of all emojis encountered during archiving, keyed by ID.
		 * @type {Map<Snowflake, CustomEmoji>}
		 */
		this.emojis = new Map();

		/**
		 * Map of all channels encountered during archiving, keyed by ID.
		 * @type {Map<Snowflake, Channel>}
		 */
		this.channels = new Map();

		/**
		 * @type {Server|Channel}
		 */
		this.data = null;

		/**
		 * Blob URLs for every saved avatar.
		 * @type {Map<Snowflake, string>}
		 */
		this.avatars = new Map();

		/**
		 * Blob URLs for every saved emoji.
		 * @type {Map<Snowflake, string>}
		 */
		this.emojiURLs = new Map();
	}

	/**
	 * Call this method once you're done using the archive
	 */
	dispose () {
		for (const avatar of this.avatars.values()) {
			URL.revokeObjectURL(avatar);
		}
	}
}

class Server {
	constructor () {
		/**
		 * The server ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The server name.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The server's icon URL.
		 * @type {string}
		 */
		this.iconURL = null;

		/**
		 * Map of current server members, keyed by ID.
		 * @type {Map<Snowflake, Member>}
		 */
		this.members = new Map();

		/**
		 * Map of server-specific custom emojis, keyed by ID.
		 * @type {Map<Snowflake, CustomEmoji>}
		 */
		this.emojis = new Map();

		/**
		 * Map of roles in the server, keyed by ID.
		 * @type {Map<Snowflake, Role>}
		 */
		this.roles = new Map();

		/**
		 * Set of channels in the server, keyed by ID.
		 * @type {Set<Snowflake>}
		 */
		this.channels = new Set();
	}
}

class Channel {
	constructor () {
		/**
		 * The channel ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The channel name.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The ID of the parent channel (category) this channel belongs to, null if no parent
		 * @type {?Snowflake}
		 */
		this.parentID = null;

		/**
		 * Array of messages in this channel.
		 * @type {Array<Message>}
		 */
		this.messages = [];

		/**
		 * Whether this channel is an NSFW channel.
		 * @type {Boolean}
		 */
		this.nsfw = false;

		/**
		 * The channel topic.
		 * @type {?string}
		 */
		this.topic = null;

		/**
		 * The position of the channel in the channel list.
		 * @type {number}
		 */
		this.position = 0;

		/**
		 * The channel type (voice, text, etc).
		 * @type {?string}
		 */
		this.type = null;

		/**
		 * This channel's pinned messages, if this is a text channel and the archive supports them.
		 * @type {?Array<Message>}
		 */
		this.pinnedMessages = null;

		/**
		 * This channel's current members, if this is a group channel.
		 * @type {?Array<Snowflake>}
		 */
		this.recipients = null;
	}
}

class Message {
	constructor () {
		/**
		 * The message ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The message author's user/member ID.
		 * @type {Snowflake}
		 */
		this.authorID = null;

		/**
		 * The message contents.
		 * @type {?string}
		 */
		this.content = null;

		/**
		 * The time at which the message was posted.
		 * @type {number}
		 */
		this.createdTimestamp = null;

		/**
		 * The time at which the message was last edited, or null if unedited.
		 * @type {?number}
		 */
		this.editedTimestamp = null;

		/**
		 * Array of message attachments.
		 * @type {?Array<Attachment>}
		 */
		this.attachments = null;

		/**
		 * The type of message (e.g. DEFAULT, USER_GUILD_JOIN).
		 * @type {?string}
		 */
		this.type = null;

		/**
		 * Array of reactions to this message.
		 * @type {?Array<MessageReaction>}
		 */
		this.reactions = null;

		/**
		 * If this message is a reply, the message it's replying to. Not an ID for performance reasons.
		 * @type {?Message}
		 */
		this.referencedMessage = null;
	}
}

class MessageReaction {
	constructor () {
		/**
		 * The number of people who have reacted with this reaction.
		 * @type {number}
		 */
		this.count = 0;

		/**
		 * This reaction's emoji. An ID if this is a custom emoji, or its Unicode representation if not.
		 * @type {Snowflake|string}
		 */
		this.emoji = null;

		/**
		 * Whether this reaction uses a custom emoji.
		 * @type {boolean}
		 */
		this.emojiIsCustom = false;

		/**
		 * The IDs of the users which have reacted with this reaction. The length may be less than `count`.
		 * @type {?Array<Snowflake>}
		 */
		this.users = null;
	}
}

class Member {
	constructor () {
		/**
		 * The member ID. Same as the member's user's ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The member's nickname, or null if they have none.
		 * @type {?string}
		 */
		this.nickname = null;

		/**
		 * Array of roles this member belongs to, ordered highest to lowest.
		 * @type {Array<Role>}
		 */
		this.roles = [];

		/**
		 * Time at which this member joined the server.
		 * Null if the archive is too old to store it.
		 * @type {?number}
		 */
		this.joinedTimestamp = null;
	}
}

class User {
	constructor () {
		/**
		 * The user ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The user's avatar URL.
		 * @type {?string}
		 */
		this.avatarURL = null;

		/**
		 * The user's username.
		 * @type {string}
		 */
		this.username = null;

		/**
		 * The user's discriminator (a 4-digit number used to distinguish between identical usernames).
		 * The leading hash mark is not included here.
		 * @type {string}
		 */
		this.discriminator = null;
	}

	get tag () {
		return this.username + '#' + this.discriminator;
	}
}

class Role {
	constructor () {
		/**
		 * The role ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The role name.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The role color.
		 * @type {string}
		 */
		this.color = null;

		/**
		 * The role permissions bitmask.
		 * @type {number}
		 */
		this.permissions = null;

		/**
		 * The position/rank of the role in the role list.
		 * @type {number}
		 */
		this.position = null;

		/**
		 * Whether the role creates a new separate category under the users list.
		 * @type {boolean}
		 */
		this.hoist = true;
	}
}

class Attachment {
	constructor () {
		/**
		 * The attachment ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The name of the attachment.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The size of the attachment, in bytes.
		 * @type {number}
		 */
		this.size = 0;

		/**
		 * The URL of the attachment.
		 * @type {string}
		 */
		this.url = null;

		/**
		 * If this attachment is an image, that image's width.
		 * @type {?string}
		 */
		this.width = null;

		/**
		 * If this attachment is an image, that image's height.
		 * @type {?string}
		 */
		this.height = null;
	}
}

class CustomEmoji {
	constructor () {
		/**
		 * Whether this is an animated emoji. Only present in Archivebot >=v11 archives.
		 * @type {?boolean}
		 */
		this.animated = null;

		/**
		 * The time at which this emoji was created. Only present in Archivebot >=v11 archives.
		 * @type {?number}
		 */
		this.createdTimestamp = null;

		/**
		 * The ID of the guild that this emoji belongs to.
		 * @type {Snowflake}
		 */
		this.guild = null;

		/**
		 * The emoji ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The identifier of this emoji, used for message reactions. Only present in Archivebot >=v11 archives.
		 * @type {?string}
		 */
		this.identifier = null;

		/**
		 * The emoji name.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The emoji URL.
		 * @type {string}
		 */
		this.url = null;
	}
}

export {Archive, Server, Channel, Message, MessageReaction, Member, User, Role, Attachment, CustomEmoji};
