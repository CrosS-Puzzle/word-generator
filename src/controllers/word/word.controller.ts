import { Request, Response } from 'express';
import { WordService } from '../../services/word.service';
import Controller, { Methods } from '../controller';

export class WordController extends Controller {
  path = '/word';
  routes = [
    {
      path: '/',
      method: Methods.POST,
      handler: this.triggerWordGeneration,
      localMiddleware: [],
    },
  ];

  constructor() {
    super();
  }

  async triggerWordGeneration(req: Request, res: Response): Promise<void> {
    const { count } = req.body;

    try {
      const wordService = new WordService(1.1);
      await wordService.loadAllCat(count);

      res.status(200).send('done');
    } catch (error: any) {
      res.status(500).send(error);
      console.log(error);
    }
  }
}
