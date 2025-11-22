export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const INITIAL_CONVERSATION: Message[] = [
  {
    role: 'system',
    content:
      'This is a conversation between user and assistant, a friendly chatbot.',
  },
];

export const HF_TO_GGUF = {
  'Llama-3.2-1B-Instruct': 'medmekk/Llama-3.2-1B-Instruct.GGUF',
  'DeepSeek-R1-Distill-Qwen-1.5B': 'medmekk/DeepSeek-R1-Distill-Qwen-1.5B.GGUF',
  'Qwen2-0.5B-Instruct': 'medmekk/Qwen2.5-0.5B-Instruct.GGUF',
  'SmolLM2-1.7B-Instruct': 'medmekk/SmolLM2-1.7B-Instruct.GGUF',
};

export const DEFAULT_GUFF = 'Llama-3.2-1B-Instruct-Q2_K.gguf'