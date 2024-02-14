import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { encodeChat } from 'gpt-tokenizer';
import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_GPT_4_TOKENS = 4096;

// Messages to prepend to the prompt messages
const systemMessages: ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content:
			'Generate the most efficient, opimized version of the given code using the given code context. Do not include any other text in the response. The code should be valid JavaScript.',
	},
];

/**
 * Count the number of tokens in the messages.
 * @param messages The messages to count.
 * @returns The number of tokens in the messages.
 */
const countTokens = (messages: ChatCompletionMessageParam[]): number => {
	return encodeChat(<ChatMessage[]>messages, 'gpt-4').length;
};

/**
 * Limit the number of tokens in the input.
 * @param input The input to limit.
 * @returns The input with a limited number of tokens.
 */
const limitInputTokens = (input: string): string => {
	if (input.length > MAX_GPT_4_TOKENS) {
		return input.substring(0, MAX_GPT_4_TOKENS);
	}

	return input;
};

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

		const tokenCount: number = countTokens(messages);
		this.totalTokensUsed += tokenCount;

		if (this.maxTokenCount && this.totalTokensUsed > this.maxTokenCount) {
			return;
		}

		// Don't surpass the maximum number of tokens for the model
		if (tokenCount > MAX_GPT_4_TOKENS) {
			// TODO: Don't hardcode the max tokens
			const limitedCode: string = limitInputTokens(code);
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

		const completionTokenCount: number = countTokens([choices[0].message]);
		this.totalTokensUsed += completionTokenCount;

		return content;
	}
}
