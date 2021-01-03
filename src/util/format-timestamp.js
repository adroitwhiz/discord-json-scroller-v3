// TODO: something a bit more user friendly than standard ISO formatting
const formatTimestamp = timestamp => new Date(timestamp).toISOString();

export default formatTimestamp;
