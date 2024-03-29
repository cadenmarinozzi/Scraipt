# Scraipt

<div align=center>
<img src='./assets/Logo.png' width=100 />
</div>

<div align="center"><strong>
Scrape away inefficient code using AI to optimize your code automatically.</strong>
<br />
Scraipt easily integrates with your code's compilation process and optimizes each function using AI.
<br /><br />

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/cadenmarinozzi/Scraipt/blob/main/LICENSE) [![Npm package version](https://badge.fury.io/js/scraipt.svg)](https://npmjs.com/package/scraipt) [![Code Grade](https://www.codefactor.io/Content/badges/A.svg)](https://www.codefactor.io/repository/github/cadenmarinozzi/Scraipt)

</div>

# Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
    -   [Webpack](#webpack)
    -   [create-react-app](#create-react-app)
    -   [Configuration](#configuration)
    -   [Functional Usage](#functional-usage)
    -   [Ignoring Functions](#ignoring-functions)
-   [Building](#building)
    -   [Testing](#testing)
-   [Potential Issues](#potential-issues)
-   [TODO](#todo)
-   [License](#license)

# Installation

To install Scraipt, run the following command in the root of your project directory:

```bash
npm install scraipt
```

# Usage

To use Scraipt, you must have an OpenAI API key. Add the following to your `.env` file or create a new file called `.env` in the root of your project if you don't already have one:

```env
OPENAI_API_KEY=your-api-key
```

## Webpack

If your project does not already have a webpack configuration, create a new file called `webpack.config.js` in the root of your project.

Add the following to your `webpack.config.js` file (Replacing "// ..." with your existing configuration):

```javascript
// ...
module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /.[jt]sx*/,
				use: ['scraipt'],
			},
		],
	},
	// ...
};
// ...
```

## create-react-app

If you are using create-react-app, you can use the `craco` package to add Scraipt to your project.

First, install `craco` if you haven't already:

```bash
npm install @craco/craco
```

Then, create a new file called `craco.config.js` in the root of your project if you don't already have one.

Add the following to your `craco.config.js` file (Replacing "// ..." with your existing configuration):

```javascript
// ...
module.exports = {
	// ...
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
								},
							},
						],
					},
				],
			},
		},
	},
	// ...
};
// ...
```

Finally, update your `package.json` file to use `craco` instead of `react-scripts` by replacing the `start`, `build`, `test`, and `eject` scripts with the following

```json
{
	"scripts": {
		"start": "craco start",
		"build": "craco build",
		"test": "craco test"
	}
}
```

You can now run `npm start` and `npm run build` as you normally would, and Scraipt will optimize your code.

## Configuration

To configure Scraipt, add an `options` array to your `webpack.config.js` or `craco.config.js` file.

### Example

```javascript
// ...
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
									// <-- Add this
									include: ['src'], // Only include files in the "src" directory
									dryRun: true, // Run Scraipt without optimizing the code
								},
							},
						],
					},
				],
			},
		},
	},
	// ...
};
// ...
```

### Options

-   `include <Array>`

    -   An array of directories to include in the optimization process. If using `create-react-app`, you may only want to include the `src` directory.
    -   Default: All files in the project directory.
    -   Example: `['src']` or if `useGlob` is enabled: `['**/src/*.js']`

-   `dryRun <Boolean>`

    -   Run Scraipt without optimizing the code. This is useful for testing Scraipt without modifying your code. This will also print the names of the files that would be optimized.
    -   Default: `false`
    -   Example: `true`

-   `model <String>`

    -   The OpenAI model to use.
    -   Default: `gpt-4`
    -   Example: `gpt-3.5-turbo`

-   `maxTokens <Number>`

    -   The maximum number of tokens to use in total for all functions.
    -   Default: No limit
    -   Example: `1000`

-   `debug <Boolean>`

    -   Write the optimized code to the build folder.
    -   Default: `false`
    -   Example: `true`

-   `buildPath <Array>`

    -   The path to write the optimized debug code to.
    -   Default: `dist`
    -   Example: `build`

-   `useGlob <Boolean>`

    -   Use glob patterns in the include option.
    -   Default: `false`
    -   Example: `true`

## Functional Usage

Scraipt can also be used easily with a functional approach. To do so, import `useScraipt` from the `scraipt/functional` library and call it with your webpack configuration.

`useScraipt(webpackConfig <optional Object>, options <optional Object>, framework <optional String>) => WebpackConfig`

-   `webpackConfig <optional Object>`

    -   Your webpack configuration.
    -   Default: `{}`

-   `options <optional Object>`

    -   The options to use with Scraipt. See [Configuration](#configuration) for a list of available options.
    -   Default: `{}`

-   `framework <optional String>`

    -   Can be `React`, or `webpack`.
    -   The framework you are using. Scraipt will try and automatically detect the framework you are using from the provided config, however, if it cannot, you can pass the framework as the third argument.
    -   Default: Autodetect

### Example

```javascript
const { useScraipt } = require('scraipt/functional');

module.exports = useScraipt(
	{
		// ... Your webpack configuration
	},
	{
		model: 'gpt-3.5-turbo',
	},
	'webpack'
);
```

## Ignoring Functions

If you would like to ignore a function from being optimized, add the following comment to the line above the function:

```javascript
// scraipt-ignore
```

### Example

```javascript
// scraipt-ignore
function fibonacci(n) {
	if (n <= 1) return n;
	return fibonacci(n - 1) + fibonacci(n - 2);
}
```

The `fibonacci` function will not be optimized by Scraipt.

# Building

To build Scraipt from source, run the following commands in the root of the project directory:

Clone the repository:

```bash
git clone https://github.com/cadenmarinozzi/Scraipt.git
```

cd into the project directory:

```bash
cd Scraipt
```

Install dependencies:

```bash
npm install
```

Build the project for either development or production:

```bash
npm run build-dev # Development (Uses tsc)
```

```bash
npm run build-production # Production (Uses webpack)
```

The built project will be in the `dist` directory.

## Testing

To run the tests, run the following command in the root of the project directory:

```bash
npm run test
```

This will run eslint on the project, build the project and run the example apps. If the tests do not complete successfully, something is wrong.

If you receive an `OpenAI API key not found` error, add your `.env` file to each test project in `example-apps`.

After running the tests, you will see the generated code in the `<buildPath>/scraipt` directory.

# Potential Issues

-   Scraipt is a new tool and may not work with all codebases. If you encounter any issues, please open an issue on the [GitHub repository](github.com/cadenmarinozzi/Scraipt).
-   Scraipt uses AI to optimize code, therefore issues may arise from the AI's generated code. Such as, but not limited to, invalid output/logic/variables, infinite loops, etc.

# TODO

See [TODO.md](TODO.md) for a list of planned features and improvements (May be outdated).

# License

Scraipt is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
