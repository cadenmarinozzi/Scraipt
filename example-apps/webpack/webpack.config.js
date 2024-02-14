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
				use: [
					{
						loader: 'scraipt',
						options: {
							include: ['src'],
							model: 'gpt-4',
							maxTokens: 10000,
							dryRun: true,
						},
					},
				],
			},
		],
	},
	resolveLoader: {
		alias: {
			scraipt: path.resolve(__dirname, '../../dist/index.js'),
		},
	},
};
