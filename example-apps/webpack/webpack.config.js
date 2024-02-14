const path = require('path');

module.exports = {
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
							model: 'gpt-3.5-turbo',
							maxTokens: 20000,
							dryRun: false,
							debug: true,
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
