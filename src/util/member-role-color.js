// TODO: return null if there's no color-- such usernames appear white in chat but grey in Discord's user list
const getMemberColor = (memberID, archive) => {
	if (archive.type !== 'server' || !archive.data.members.has(memberID)) return 'white';
	const member = archive.data.members.get(memberID);

	let highestRolePosition = -1;
	let highestRoleColor = 'white';

	for (const role of member.roles) {
		// Black means "no color" for some reason. Fun fact: this is actually how Discord represents it-- try picking
		// the color black for a role, and it won't work.
		if (role.color === '#000000') continue;
		if (role.position > highestRolePosition) {
			highestRolePosition = role.position;
			highestRoleColor = role.color;
		}
	}

	return highestRoleColor;
};

export default getMemberColor;
