const shouldSplitMessages = (first, second) => {
	return first.authorID !== second.authorID || second.referencedMessage !== null;
};

export default shouldSplitMessages;
