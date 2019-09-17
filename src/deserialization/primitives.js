class Server {
	constructor () {
		/**
		 * The server ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The server name.
		 * @type {String}
		 */
		this.name = null;

		/**
		 * The server's icon URL.
		 * @type {String}
		 */
		this.iconURL = null;

		/**
		 * Map of current server members, keyed by ID.
		 * @type {Map<Snowflake, Member>}
		 */
		this.members = new Map();

		/**
		 * Map of server-specific custom emojis, keyed by ID.
		 * @type {Map<Snowflake, Emoji>}
		 */
		this.emojis = new Map();

		/**
		 * Map of roles in the server, keyed by ID.
		 * @type {Map<Snowflake, Role>}
		 */
		this.roles = new Map();

		/**
		 * Map of channels in the server, keyed by ID.
		 * @type {Map<Snowflake, Channel>}
		 */
		this.channels = new Map();
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
		 * @type {String}
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
		 * @type {?Boolean}
		 */
		this.nsfw = null;

		/**
		 * The channel topic.
		 * @type {?String}
		 */
		this.topic = null;

		/**
		 * The position of the channel in the channel list.
		 * @type {?String}
		 */
		this.position = null;

		/**
		 * The channel type (voice, text, etc).
		 * @type {?String}
		 */
		this.type = null;
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
		 * @type {?String}
		 */
		this.content = null;

		/**
		 * The time at which the message was posted.
		 * @type {Number}
		 */
		this.createdTimestamp = null;

		/**
		 * The time at which the message was last edited, or null if unedited.
		 * @type {?Number}
		 */
		this.editedTimestamp = null;

		/**
		 * Array of message attachments.
		 * @type {Array<Attachment>}
		 */
		this.attachments = [];

		/**
		 * The type of message (e.g. DEFAULT, USER_GUILD_JOIN).
		 * @type {?String}
		 */
		this.type = null;
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
		 * @type {?String}
		 */
		this.nickname = null;

		/**
		 * Array of roles this member belongs to.
		 * @type {Array<Role>}
		 */
		this.roles = [];

		/**
		 * The user.
		 * @type {User}
		 */
		this.user = null;
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
		 * @type {?String}
		 */
		this.avatarURL = null;

		/**
		 * The user's username.
		 * @type {String}
		 */
		this.username = null;

		/**
		 * The user's Discord tag (username + discriminator).
		 * @type {String}
		 */
		this.tag = null;
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
		 * @type {String}
		 */
		this.name = null;

		/**
		 * The role color.
		 * @type {String}
		 */
		this.color = null;

		/**
		 * The role permissions bitmask.
		 * @type {Number}
		 */
		this.permissions = null;

		/**
		 * The position/rank of the role in the role list.
		 * @type {Number}
		 */
		this.position = null;
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
		 * @type {String}
		 */
		this.name = null;

		/**
		 * The size of the attachment, in bytes.
		 * @type {Number}
		 */
		this.size = null;

		/**
		 * The URL of the attachment.
		 * @type {String}
		 */
		this.url = null;
	}
}

class Emoji {
	constructor () {
		/**
		 * The emoji ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The emoji name.
		 * @type {String}
		 */
		this.name = null;

		/**
		 * The emoji URL.
		 * @type {?String}
		 */
		this.url = null;
	}
}

export {Server, Channel, Message, Member, User, Role, Attachment, Emoji};
