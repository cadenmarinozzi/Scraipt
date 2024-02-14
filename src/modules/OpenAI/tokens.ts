import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { encodeChat } from 'gpt-tokenizer';

interface MaxModelTokens {
	[model: string]: number;
}

const maxModelTokens: MaxModelTokens = {
	'gpt-4': 8192,
	'gpt-4-0613': 8192,
	'gpt-4-32k': 32768,
	'gpt-4-32k-0613': 32768,
	'gpt-4-0125-preview': 128000,
	'gpt-4-turbo-preview': 128000,
	'gpt-4-1106-preview': 128000,
	'gpt-4-vision-preview': 128000,
	'gpt-3.5-turbo-0125': 16385,
	'gpt-3.5-turbo-1106': 16385,
	'gpt-3.5-turbo': 4096,
	'gpt-3.5-turbo-instruct': 4096,
};

/**
 * Get the maximum number of tokens for the model.
 * @param model The model to get the maximum number of tokens for.
 * @returns The maximum number of tokens for the model.
 */
export const getMaxModelTokens = (model: string): number => {
	return maxModelTokens[model] ?? 4096;
};

/**
 * Count the number of tokens in the messages.
 * @param messages The messages to count.
 * @param model The model to use for the messages.
 * @returns The number of tokens in the messages.
 */
export const countTokens = (
	messages: ChatCompletionMessageParam[],
	model: string
): number => {
	return encodeChat(<ChatMessage[]>messages, <any>model).length;
};

/**
 * Limit the number of tokens in the input.
 * @param input The input to limit.
 * @param model The model to use for the input.
 * @returns The input with a limited number of tokens.
 */
export const limitInputTokens = (input: string, model: string): string => {
	const maxTokens: number = getMaxModelTokens(model);

	if (input.length > maxTokens) {
		return input.substring(0, maxTokens);
	}

	return input;
};
