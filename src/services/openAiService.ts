import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async sendMessage(message: string, prePrompt?: string) {
    if (!this.apiKey) {
      throw new Error('API key is missing.');
    }

    try {
      const messages = [];
      if (prePrompt) {
        messages.push({ role: 'system', content: prePrompt });
      }
      messages.push({ role: 'user', content: message });

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: this.model,
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API Key');
      }
      if (error.code === 'ECONNABORTED' || !error.response) {
        throw new Error('Connection failure. Make sure you have turned on the VPN.');
      }
      throw error;
    }
  }
}