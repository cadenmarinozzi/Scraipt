import chalk from 'chalk';
import path from 'path';

const detectFramework = (config: any): string => {
	if (config.webpack && config.webpack.configure) {
		return 'React';
	}

	if (config.entry || config.output) {
		return 'webpack';
	}

	console.log(
		`${chalk.yellow(
			'Warning:'
		)} Could not detect framework. Defaulting to webpack.`
	);

	// TODO: throw Error?
	return 'webpack';
};

module.exports.useScraipt(
	(
		config: any = {},
		options: any = {},
		framework: string | undefined
	): any => {
		if (!framework) {
			framework = detectFramework(config);
		}

		if (framework === 'React') {
			if (!config.webpack) {
				config.webpack = {};
			}

			if (!config.webpack.configure) {
				config.webpack.configure = {};
			}

			if (!config.webpack.configure.module) {
				config.webpack.configure.module = {};
			}

			if (!config.webpack.configure.module.rules) {
				config.webpack.configure.module.rules = [];
			}

			config.webpack.configure.module.rules.push({
				test: /.[jt]sx*/,
				use: [
					{
						loader: 'scraipt',
						options: {
							// Default to include src folder only
							include: ['src'],
							...options,
						},
					},
				],
			});
		} else if (framework === 'webpack') {
			if (!config.module) {
				config.module = {};
			}

			if (!config.module.rules) {
				config.module.rules = [];
			}

			config.module.rules.push({
				test: /.[jt]sx*/,
				use: [
					{
						loader: 'scraipt',
						options,
					},
				],
			});
		}

		return config;
	}
);
