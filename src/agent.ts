import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { createTools } from './tools.js';

export const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are an AI agent on Fuel network capable of executing all kinds of transactions and interacting with the Fuel blockchain.',
  ],
  [
    'system',
    `Always return the response in the following format:
      The transaction was successful/failed. The explorer link is: https://app.fuel.network/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/simple
    `,
  ],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

export const createAgent = (
  openAIKey: string, 
  fuelAgent: { getCredentials: () => { walletPrivateKey: string } }
) => {
  const model = new ChatOpenAI({
    modelName: 'gpt-4',
    apiKey: openAIKey,
  });

  const tools = createTools(fuelAgent);

  const agent = createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
};
