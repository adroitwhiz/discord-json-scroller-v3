import deserializeArchiveBot from './deserialize-archivebot';
import deserializeToonMemeBotServer from './deserialize-toonmemebot-server';
import deserializeToonMemeBotChannel from './deserialize-toonmemebot-channel';

// Try to determine archive version.
// Current known versions:
// 'toonmemebot-channel-snapshot': ToonMemeBot single-channel snapshot
// 'toonmemebot-server-snapshot': ToonMemeBot server snapshot
// 'archivebot-v1': ArchiveBot server snapshot v1
// 'archivebot-v2': ArchiveBot server snapshot v2 (v1 but with version tag)
const getArchiveVersion = parsed => {
	// If the archive gives us a version string, use that
	if (parsed.version) {
		return parsed.version;
	}

	// ToonMemeBot single-channel snapshots are arrays of JSON strings
	if (parsed instanceof Array) {
		return 'toonmemebot-channel-snapshot';
	}

	// Both ArchiveBot archives and ToonMemeBot snapshots contain these properties
	if (parsed.channels && parsed.members && parsed.emojis) {
		// ArchiveBot archives contain server ID, ToonMemeBot snapshots do not
		if (parsed.id) {
			return 'archivebot-v1';
		} else {
			return 'toonmemebot-server-snapshot';
		}
	}

	return null;
};

const deserializeArchive = json => {
	const version = getArchiveVersion(json);

	switch (version) {
		case 'archivebot-v1':
		case 'archivebot-v2':
		case 'archivebot-v3': {
			return deserializeArchiveBot(json);
		}
		case 'toonmemebot-server-snapshot': {
			return deserializeToonMemeBotServer(json);
		}
		case 'toonmemebot-channel-snapshot': {
			return deserializeToonMemeBotChannel(json);
		}
		default:
			throw new Error(`Unknown archive version ${version}`);
	}
};

export default deserializeArchive;
