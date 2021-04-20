import emojis from './emojis.json';

export default str => {
	if (Object.prototype.hasOwnProperty.call(emojis, str)) return emojis[str].names[0];
	return null;
};
