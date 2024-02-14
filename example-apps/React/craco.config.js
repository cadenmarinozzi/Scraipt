const path = require('path');

module.exports = {
	webpack: {
		configure: {
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
									buildPath: 'build',
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
