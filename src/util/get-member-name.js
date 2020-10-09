export default (memberID, archive, prefixWithAt = false) => {
	const member = archive.type === 'server' && archive.data.members.get(memberID);
	const prefix = prefixWithAt ? '@' : '';
	if (member && member.nickname !== null) return prefix + member.nickname;

	const user = archive.users.get(memberID);
	if (user && user.username !== 'Deleted User') return prefix + user.username;

	return `<@${memberID}>`;
};
