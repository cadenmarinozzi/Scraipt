# Scraipt

Scraipt scrapes away inefficient code using AI to optimize your code automatically.

## What does Scraipt do?

Scraipt integrates with your code's compilation process and optimizes each function using AI during compilation.

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

Add the following to your `webpack.config.js` file (Replacing "..." with your existing configuration):

```javascript
...
module.exports = {
    ...
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
    ...
};
...
```

## create-react-app

If you are using create-react-app, you can use the `craco` package to add Scraipt to your project.

First, install `craco` if you haven't already:

```bash
npm install @craco/craco
```

Then, create a new file called `craco.config.js` in the root of your project if you don't already have one.

Add the following to your `craco.config.js` file (Replacing "..." with your existing configuration):

```javascript
...
module.exports = {
    ...
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
        },
    },
    ...
};
...
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

## Ignoring Functions

If you would like to ignore a function from being optimized, add the following comment to the top of the function:

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

Build the project:

```bash
npm run build
```

## Testing

To run the tests, run the following command in the root of the project directory:

```bash
npm run test
```

This will run eslint on the project, build the project and run the example apps. If the tests do not complete successfully, something is wrong.

If you receive a "OpenAI API key not found" error, add your ``.env` file to each test project in "example-apps".

## Debug output

While testing, if you want to see the source code the AI has generated, add the following to your `.env` file:

```env
DEBUG=true
```

After running the tests, you will see the generated code in the `dist/scraipt` directory.

# Potential Issues

-   Scraipt is a new tool and may not work with all codebases. If you encounter any issues, please open an issue on the [GitHub repository](github.com/cadenmarinozzi/Scraipt).
-   Scraipt uses AI to optimize code, therefore issues may arise from the AI's generated code. Such as, but not limited to, invalid output/logic/variables, infinite loops, etc.

# TODO

See [TODO.md](TODO.md) for a list of planned features and improvements (May be outdated).

# License

Scraipt is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
