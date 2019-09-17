module.exports = {
	runtimeCompiler: false,
	publicPath: process.env.NODE_ENV === 'production' ? '/discord-json-scroller-v2/' : '/',
	devServer: {
		port: 8082
	}
};
