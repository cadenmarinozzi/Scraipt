const path = require('path');

module.exports = {
	context: __dirname,
	node: {
		__filename: true,
	},
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /.[jt]sx*/,
				use: ['scraipt'],
			},
		],
	},
	resolveLoader: {
		alias: {
			scraipt: path.resolve(__dirname, '../../dist/index.js'),
		},
	},
};
