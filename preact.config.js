export default (config, env, helpers) => {
	config.output.publicPath = './';

	const handleError = () => {
		throw new Error('Webpack configuration format changed.\
Thanks preact-cli for your innovative "blind configuration" paradigm!');
	};

	const assert = predicate => {
		if (!predicate) handleError();
	};

	const cssRules = helpers.getRulesByMatchingFile(config, '.css');
	assert(cssRules.length === 2);

	const includeRules = cssRules.filter(rule => rule.rule.hasOwnProperty('include'));
	assert(includeRules.length === 1);
	const includeRule = includeRules[0];

	const excludeRules = cssRules.filter(rule => rule.rule.hasOwnProperty('exclude'));
	assert(excludeRules.length === 1);
	const excludeRule = excludeRules[0];

	const localCssPaths = includeRule.rule.include;

	localCssPaths.push(env.source('icons'));
	excludeRule.rule.exclude = localCssPaths;
};
