import { Request, Response } from 'express';
import { TestService } from '../../services/test.service';
import Controller, { Methods } from '../controller';

export class TestController extends Controller {
  path = '/test';
  routes = [
    {
      path: '/',
      method: Methods.GET,
      handler: this.healthCheck,
      localMiddleware: [],
    },
  ];

  constructor() {
    super();
  }

  async healthCheck(_: Request, res: Response): Promise<void> {
    try {
      const testService = new TestService();
      res.status(200).send(testService.performTest());
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
}
