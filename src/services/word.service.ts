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

interface IMessage {
  role: string;
  content: any;
}

interface IWord {
  value: string;
  description: string;
  category: Category | string;
}

export class WordService {
  private temperature: number;

  constructor(temperature: number) {
    this.temperature = temperature;
  }

  public async loadWord(count: number = 3) {
    const wordRepository = new WordRepository();

    const words_OS = this.getWordList(Category.OS, count);
    const words_DS = this.getWordList(Category.DS, count);
    const words_DB = this.getWordList(Category.DATABASE, count);
    const words_Network = this.getWordList(Category.NETWORK, count);
    const words_DesignPattern = this.getWordList(Category.DESIGNPATTERN, count);
    const words_Algorithm = this.getWordList(Category.ALGORITHM, count);

    return Promise.all([
      words_OS,
      words_DS,
      words_DB,
      words_Network,
      words_DesignPattern,
      words_Algorithm,
    ]).then((values) => {
      const wordList: IWord[] = [];
      values.forEach((value) => {
        wordList.push(...value);
      });

      return wordRepository.createMany(wordList as Mongo_IWord[]);
    });
  }

  public async getWordList(category: Category, count: number) {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Select ${count} random terms related to ${category}.
             The terms should be Computer-Science major student level,
             Return the terms and their explanations in JSON format. 
             When returning, provide the terms in Korean and explanations in Korean. 
             Descriptions should be 30 to 40 characters. 
             For Example: { result: [["라우팅", "데이터를 목적지까지 안전하고 효율적으로 전송하기 위해 경로 결정을 하는 네트워크 프로세스입니다."]]}`,
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
      result: [[value: string, description: string]];
    } = JSON.parse(content);

    const wordList = parsedContent.result.map((row) => {
      return {
        value: row[0].replaceAll(' ', ''),
        description: row[1],
        category: category,
      };
    });

    return wordList.filter((word) => word.value.length > 1);
  }
}
