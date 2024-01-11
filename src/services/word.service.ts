import { OPENAI_API_KEY } from '../config';
import { WordRepository } from '../repositories/\bword.repository';

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
  content: any;
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
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
        temperature: this.temperature,
      }),
    });

    const resultToJson: IOpenAIResponse = await result.json();

    const content = resultToJson.choices[0].message.content;

    const parsedContent: {
      result: [
        {
          value: string;
          desc: string;
        },
      ];
    } = this.parseWord(content);

    // console.log(parsedWords);
    const wordList = parsedContent.result;

    for await (const word of wordList) {
      const { value, desc } = word;
      // this.wordRepo.create({
      //   value,
      //   category: 'design-pattern',
      //   description: desc,
      // });
    }

    return 'success';
  }

  private parseWord(input: string) {
    return JSON.parse(input);
  }
}
