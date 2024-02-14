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
		},
	},
};
