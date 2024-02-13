# Scraipt

Scraipt is a simple, compile-time AI code optimization tool to improve inefficient code automatically.

## What does Scraipt do?

Scraipt integrates with your code's compilation process and optimizes each function using AI.

# Installation

```bash
npm install scraipt
```

# Usage

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

# Potential Issues

-   Scraipt is a new tool and may not work with all codebases. If you encounter any issues, please open an issue on the [GitHub repository](github.com/cadenmarinozzi/Scraipt).
-   Scraipt uses AI to optimize code, therefore issues may arise from the AI's generated code. Such as, but not limited to, invalid output/logic/variables, infinite loops, etc.

# License

Scraipt is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
