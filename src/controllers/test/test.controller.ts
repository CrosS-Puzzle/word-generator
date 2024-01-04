import { Request, Response } from 'express';
import { TestService } from '../../services/test.service';
import { WordService } from '../../services/word.service';

export class TestController {
  private testSerivce: TestService;
  private wordService: WordService;

  constructor() {
    this.testSerivce = new TestService();
    this.wordService = new WordService(1.0);
  }

  public async base(_: Request, response: Response) {
    const result = await this.testSerivce.performTest();

    response.send(result);
  }

  public async word(request: Request, response: Response) {
    const messages = [
      {
        role: 'user',
        content:
          'Select 2 random computer science terms related to design-pattern, return the terms and their explanations in JSON format. When returning, the terms and explanations must be in Korean. Descriptions should be within 30 characters. For Example, return should be like "{"result":[{"value":"옵저버","desc":"옵저버패턴은객체사이의일대다의존성을정의하는데사용되는디자인패턴으로써한객체의상태변화에따라다른객체들이자동으로업데이트됩니다."}]}}"',
      },
    ];

    const result = await this.wordService.getWord(messages);
    response.send(result);
  }
}
