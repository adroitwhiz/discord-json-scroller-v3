import {unzip} from 'unzipit';

import deserializeArchiveBotArchive from './deserialize-archivebot-archive';
import deserializeArchiveBotServer from './deserialize-archivebot-server';
import deserializeToonMemeBotServer from './deserialize-toonmemebot-server';
import deserializeToonMemeBotChannel from './deserialize-toonmemebot-channel';

// Try to determine archive version.
// Current known versions:
// 'toonmemebot-channel-snapshot': ToonMemeBot single-channel snapshot
// 'toonmemebot-server-snapshot': ToonMemeBot server snapshot
// 'archivebot-v1': ArchiveBot server snapshot v1
// 'archivebot-v2': ArchiveBot server snapshot v2 (v1 but with version tag)
const _getArchiveVersion = parsed => {
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

/**
 * Deserialize archive from a file
 * @param {File} file
 */
const deserializeArchiveFile = async file => {
	const reader = new FileReader();
	const buffer = await new Promise((resolve, reject) => {
		reader.addEventListener('load', () => {
			resolve(reader.result);
		});
		reader.addEventListener('error', () => {
			reject(reader.error);
		});
		reader.readAsArrayBuffer(file);
	});
	const dv = new DataView(buffer);
	let type, jsonText;
	let zipData = null;
	if (
		// zip file signature
		dv.getInt8(0) === 0x50 &&
		dv.getInt8(1) === 0x4b &&
		dv.getInt8(2) === 0x03 &&
		dv.getInt8(3) === 0x04
	) {
		const zip = await unzip(buffer);
		const {entries} = zip;
		const files = Object.values(entries);
		if (files.length === 1) {
			type = 'text';
			jsonText = await files[0].text();
		} else {
			if (Object.prototype.hasOwnProperty.call(entries, 'archive.json')) {
				type = 'zip';
				jsonText = await entries['archive.json'].text();
				zipData = zip;
			} else {
				throw 'Invalid .zip archive';
			}
		}
	} else {
		type = 'text';
		jsonText = (new TextDecoder()).decode(buffer);
	}
	const json = JSON.parse(jsonText);

	const version = _getArchiveVersion(json);

	switch (version) {
		case 'archivebot-v1':
		case 'archivebot-v2':
		case 'archivebot-v3':
		case 'archivebot-v4':
		case 'archivebot-v5':
		case 'archivebot-v6':
		case 'archivebot-v7':
		case 'archivebot-v8': {
			return deserializeArchiveBotServer(json);
		}
		case 'archivebot-v9':
		case 'archivebot-v10': {
			return deserializeArchiveBotArchive(json, type === 'zip' ? zipData : null);
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

export default deserializeArchiveFile;
