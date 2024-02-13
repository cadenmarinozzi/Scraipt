import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Messages to prepend to the prompt messages
const systemMessages: ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content:
			'Generate the most efficient, opimized version of the given code. Do not include any other text in the response. The code should be valid JavaScript.',
	},
];

/**
    Adds system messages to the prompt messages.
    * @param messages The messages to use for the completion.
    * @returns The messages with the system messages prepended.
*/
const createMessages = (
	messages: ChatCompletionMessageParam[]
): ChatCompletionMessageParam[] => {
	return systemMessages.concat(messages);
};

/**
    A class to interact with the OpenAI API.
*/
export class OpenAIAPI {
	openai: OpenAI;

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
	}

	/**
	 * Create a text completion using the given messages.
	 * @param messages The messages to use for the completion.
	 * @returns The completion text.
	 */
	async createTextCompletion(
		messages: ChatCompletionMessageParam[]
	): Promise<string | undefined> {
		// Add system messages to the prompt messages
		messages = createMessages(messages);

		const result = await this.openai.chat.completions.create({
			messages,
			model: 'gpt-4',
		});

		const choices = result.choices;

		if (!choices) {
			return;
		}

		const content = choices[0].message.content;

		if (!content) {
			return;
		}

		return content;
	}
}
