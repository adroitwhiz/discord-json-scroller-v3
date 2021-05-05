const shouldSplitMessages = (first, second) => {
	return (
		first.authorID !== second.authorID ||
		second.referencedMessage !== null ||
		Math.abs(second.createdTimestamp - first.createdTimestamp) >= (60 * 60 * 1000)
	);
};

export default shouldSplitMessages;
