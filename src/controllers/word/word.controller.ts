import { Request, Response } from 'express';
import { WordService } from '../../services/word.service';
import Controller, { Methods } from '../controller';
import { TestService } from '../../services/test.service';
import { Category } from '../../types/category.type';

export class WordController extends Controller {
  path = '/word';
  routes = [
    {
      path: '/health',
      method: Methods.GET,
      handler: this.healthCheck,
      localMiddleware: [],
    },
    {
      path: '/generate',
      method: Methods.POST,
      handler: this.generateWord,
      localMiddleware: [],
    },
    {
      path: '/generateByCat',
      method: Methods.POST,
      handler: this.generateWordByCat,
      localMiddleware: [],
    }
  ];

  constructor() {
    super();
  }

  async generateWord(req: Request, res: Response): Promise<void> {
    try {
      const { count } = req.body;

      if (!count) {
        res.status(400).send('count is required');
        return;
      }

      const wordService = new WordService(1.1);
      await wordService.loadAllCat(count);

      res.status(200).send('done');
      return;
    } catch (error: any) {
      res.status(500).send(error);
      console.log('[ERROR_generateWord]', error);
    }
  }

  async generateWordByCat(req: Request, res: Response): Promise<void> {
    try {
      const { count, category } = req.body;

      if (!count || !category) {
        res.status(400).send('count and category are required');
        return;
      }

      if (!Object.values(Category).includes(category)) {
        res.status(400).send('invalid category');
        return;
      }

      const wordService = new WordService(1.1);
      await wordService.loadACat(category, count);

      res.status(200).send('done');
      return;
    } catch (error: any) {
      res.send(500).send(error);
      console.log('[ERROR_generateWordByCat]', error);
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const testService = new TestService();

      res.status(200).send(testService.performTest());
      return;
    } catch (error: any) {
      res.status(500).send(error);
      console.log('[ERROR_healthCheck]', error);
    }
  }
}
