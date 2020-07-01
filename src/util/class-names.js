export default classNames => {
	const activeClasses = [];
	for (const name in classNames) {
		if (Object.prototype.hasOwnProperty.call(classNames, name) &&
			classNames[name]) {
			activeClasses.push(name);
		}
	}
	return activeClasses.join(' ');
};
