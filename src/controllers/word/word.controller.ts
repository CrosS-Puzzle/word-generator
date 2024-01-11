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
    try {
      res.status(200).send('success');
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
}
