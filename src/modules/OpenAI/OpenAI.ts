import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { countTokens, getMaxModelTokens, limitInputTokens } from './tokens';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Messages to prepend to the prompt messages
const systemMessages: ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content:
			'Generate the most efficient, opimized version of the given code using the given code context. Do not include any other text in the response. The code should be valid JavaScript.',
	},
];

/**
    Add system messages to the prompt messages.
    * @param context The context of the code.
    * @param code The code to append.
    * @returns The messages to use for the completion.
*/
const createMessages = (
	context: string,
	code: string
): ChatCompletionMessageParam[] => {
	return systemMessages.concat([
		{
			role: 'user',
			content: context,
		},
		{
			role: 'user',
			content: code,
		},
	]);
};

/**
    A class to interact with the OpenAI API.
*/
export class OpenAIAPI {
	openai: OpenAI;
	totalTokensUsed: number;
	maxTokenCount: number | undefined;

	/**
	 * Create a new instance of the OpenAIAPI class.
	 * @throws An error if the OpenAI API key is not found.
	 */
	constructor() {
		if (!OPENAI_API_KEY) {
			throw new Error('OpenAI API key not found');
		}

		this.openai = new OpenAI({
			apiKey: OPENAI_API_KEY,
		});

		this.totalTokensUsed = 0;
	}

	/**
	 * Create a text completion using the given messages.
	 * @param code The code to optimize.
	 * @param context The context of the code.
	 * @param model The model to use for the completion.
	 * @returns The completion text.
	 */
	async createTextCompletion(
		code: string,
		context: string,
		model: string
	): Promise<string | undefined> {
		// Add system messages to the prompt messages
		let messages: ChatCompletionMessageParam[] = createMessages(
			context,
			code
		);

		const tokenCount: number = countTokens(messages, model);
		this.totalTokensUsed += tokenCount;

		if (this.maxTokenCount && this.totalTokensUsed > this.maxTokenCount) {
			return;
		}

		// Don't surpass the maximum number of tokens for the model
		if (tokenCount > getMaxModelTokens(model)) {
			const limitedCode: string = limitInputTokens(code, model);
			const limitedMessages: ChatCompletionMessageParam[] =
				createMessages(context, limitedCode);

			messages = limitedMessages;
		}

		const result = await this.openai.chat.completions.create({
			messages,
			model,
		});

		const choices: OpenAI.Chat.Completions.ChatCompletion.Choice[] =
			result.choices;

		if (!choices) {
			return;
		}

		const content: string | null = choices[0].message.content;

		if (!content) {
			return;
		}

		const completionTokenCount: number = countTokens(
			[choices[0].message],
			model
		);
		this.totalTokensUsed += completionTokenCount;

		return content;
	}
}
