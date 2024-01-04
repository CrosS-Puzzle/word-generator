interface IOpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint: string;
}

interface IMessage {
  role: string;
  content: string;
}

export class WordService {
  private temperature: number;

  constructor(temperature: number) {
    this.temperature = temperature;
  }

  public async getWord(messages: IMessage[]) {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
        temperature: this.temperature,
      }),
    });

    const resultToJson: IOpenAIResponse = await result.json();

    const words = resultToJson.choices[0].message.content;

    return this.parseWord(words);
  }

  private parseWord(input: string) {
    return JSON.parse(input);
  }
}
