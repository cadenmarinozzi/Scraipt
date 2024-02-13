const path = require('path');

module.exports = {
	webpack: {
		configure: {
			context: __dirname,
			node: {
				__filename: true,
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
					scraipt: path.resolve(__dirname, '../../build/index.js'),
				},
			},
		},
	},
};
