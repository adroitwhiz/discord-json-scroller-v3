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
		 * Map of all users who have ever been in this server, keyed by ID.
		 * @type {Map<Snowflake, User>}
		 */
		this.users = new Map();

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
		 * @type {Array<Attachment>}
		 */
		this.attachments = [];

		/**
		 * The type of message (e.g. DEFAULT, USER_GUILD_JOIN).
		 * @type {?string}
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
		 * @type {?string}
		 */
		this.nickname = null;

		/**
		 * Array of roles this member belongs to.
		 * @type {Array<Role>}
		 */
		this.roles = [];
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

class Emoji {
	constructor () {
		/**
		 * The emoji ID.
		 * @type {Snowflake}
		 */
		this.id = null;

		/**
		 * The emoji name.
		 * @type {string}
		 */
		this.name = null;

		/**
		 * The emoji URL.
		 * @type {?string}
		 */
		this.url = null;
	}
}

export {Server, Channel, Message, Member, User, Role, Attachment, Emoji};
