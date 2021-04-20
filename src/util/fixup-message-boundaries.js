const fixupMessageStart = (start, messages) => {
	// Clamp within valid message range
	let fixed = Math.max(0, Math.min(start, messages.length - 1));
	if (messages.length === 0) return fixed;

	const startUser = messages[fixed].authorID;

	// Extend so that all messages in "string" from that user are visible
	while (fixed > 0 && messages[fixed - 1].authorID === startUser) {
		fixed--;
	}

	return fixed;
};

const fixupMessageEnd = (end, messages) => {
	// Clamp within valid message range
	let fixed = Math.max(0, Math.min(end, messages.length - 1));
	if (messages.length === 0) return fixed;

	const startUser = messages[fixed].authorID;

	// Extend so that all messages in "string" from that user are visible
	while (fixed < messages.length - 1 && messages[fixed + 1].authorID === startUser) {
		fixed++;
	}

	return fixed;
};

export {fixupMessageStart, fixupMessageEnd};
