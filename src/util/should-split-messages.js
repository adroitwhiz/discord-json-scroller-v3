const shouldSplitMessages = (first, second) => {
	return first.authorID !== second.authorID;
};

export default shouldSplitMessages;
