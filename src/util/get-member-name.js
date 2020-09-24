export default (memberID, archive) => {
	const member = archive.members.get(memberID);
	if (member && member.nickname !== null) return member.nickname;

	const user = archive.users.get(memberID);
	if (user && user.username !== 'Deleted User') return user.username;

	return `<@${memberID}>`;
};
