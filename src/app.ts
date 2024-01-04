import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

import MongoConfig from './config/mongoose.config';
import { TestController } from './controllers/test/test.controller';

class App {
  private app: express.Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.middlewares();
    this.dbConnection().then(() => {
      this.routes();
    });
  }

  private async dbConnection() {
    const { MONGODB_URI, MONGODB_DBNAME } = process.env;

    if (MONGODB_URI === undefined) throw new Error('MONGODB_URI not defined.');
    if (MONGODB_DBNAME === undefined)
      throw new Error('MONGODB_DBNAME not defined.');

    const mongo = new MongoConfig();
    const dbOptions: ConnectOptions = {
      dbName: MONGODB_DBNAME,
    };
    await mongo.connect(MONGODB_URI, dbOptions);
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private routes() {
    const testController = new TestController();

    this.app.get('/', (_: Request, response: Response) => {
      response.send('Hello, world!');
    });

    this.app.use('/test', (request: Request, response: Response) => {
      testController.base(request, response);
    });

    this.app.use('/word', (request: Request, response: Response) => {
      testController.word(request, response);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const app: App = new App();

export default app.getApp();
