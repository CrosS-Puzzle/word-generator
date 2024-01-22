import { OPENAI_API_KEY } from '../config';
import { WordRepository } from '../repositories/\bword.repository';
import { Category } from '../types/category.type';
import { IWord as Mongo_IWord } from '../models/word.model';

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

interface IWord {
  value: string;
  description: string;
  category: Category | string;
}

export class WordService {
  private temperature: number;

  constructor(temperature: number = 1.10) {
    this.temperature = temperature;
  }

  public async loadAllCat(count: number = 3) {
    for await (const category of Object.values(Category)) {
      await this.loadACat(category, count);
    }

    return;
  }

  public async loadACat(category: Category, count: number = 3) {
    const wordRepository = new WordRepository();

    const words = await this.fetchWordList(category, count);

    const filteredWords: string[] = [];

    for await (const word of words) {
      const isExist = await wordRepository.isExist(word);
      if (!isExist) filteredWords.push(word);
    }

    const result = await this.fetchWordDescription(filteredWords, category);

    for await (const word of result) {
      await wordRepository.create(word as Mongo_IWord);
    }

    return;
  }

  public async fetchWordList(category: Category, count: number) {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content:
              'You will be provided with a category and a number. Your task is to provide terms that are related to the category and computer science.',
          },
          {
            role: 'system',
            content: `Words should be in Korean and return should be in JSON format.`,
          },
          {
            role: 'system',
            content: `For Example, category is Operating System and count is 3: { result: ["용어1", "용어2", "용어3"] }`,
          },
          {
            role: 'user',
            content: `Category is ${category} and count is ${count}.`,
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
        temperature: this.temperature,
      }),
    });

    const resultToJson: IOpenAIResponse = await result.json();
    const content = resultToJson.choices[0].message.content;

    const parsedContent: {
      result: string[];
    } = JSON.parse(content);

    return parsedContent.result.map((word: string) => word.replaceAll(' ', ''));
  }

  public async fetchWordDescription(words: string[], category: Category) {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content:
              'You will be provided with array of words. Your task is to provide the description of each word in Korean.',
          },
          {
            role: 'system',
            content: `For example, if the array of words like ["라우팅", "라우터"], you should provide the description of the word in Korean.
                      And return should be in JSON format.`,
          },
          {
            role: 'system',
            content: `For Example: { result: [{term: "라우팅", description: "어떤 네트워크 안에서 통신 데이터를 보낼 때 최적의 경로를 선택하는 과정이다. 전화 통신망, 전자 정보 통신망, 그리고 교통망 등 여러 종류의 네트워크에서 사용된다"}]}`,
          },
          { role: 'user', content: JSON.stringify(words) },
        ],
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
        temperature: this.temperature,
      }),
    });

    const resultToJson: IOpenAIResponse = await result.json();
    const content = resultToJson.choices[0].message.content;

    const parsedContent: {
      result: [{ term: string; description: string }];
    } = JSON.parse(content);

    const wordList = parsedContent?.result?.map((row) => {
      const { term, description } = row;

      const forHiding = 'O'.repeat(term.length);

      if (!term || !description)
        return {
          value: '',
          description: '',
          category: category,
        };

      return {
        value: row.term.replaceAll(' ', ''),
        description: row.description,
        category: category.replaceAll(term, forHiding),
      };
    });

    if (!wordList) return [];

    const filteredList = wordList.filter(
      (word: IWord) => word.value.length > 1
    );

    return filteredList;
  }
}
