import shouldSplitMessages from './should-split-messages';

const fixupMessageStart = (start, messages) => {
	// Clamp within valid message range
	let fixed = Math.max(0, Math.min(start, messages.length - 1));
	if (messages.length === 0) return fixed;

	// Extend so that all messages in "string" from that user are visible
	while (fixed > 0 && !shouldSplitMessages(messages[fixed - 1], messages[fixed])) {
		fixed--;
	}

	return fixed;
};

const fixupMessageEnd = (end, messages) => {
	// Clamp within valid message range
	let fixed = Math.max(0, Math.min(end, messages.length - 1));
	if (messages.length === 0) return fixed;

	// Extend so that all messages in "string" from that user are visible
	while (fixed < messages.length - 1 && !shouldSplitMessages(messages[fixed], messages[fixed + 1])) {
		fixed++;
	}

	return fixed;
};

export {fixupMessageStart, fixupMessageEnd};
