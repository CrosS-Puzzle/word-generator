import express, { Request, Response, json, urlencoded } from 'express';
import cors from 'cors';
import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

import MongoManager from './services/mongoose/mongoose';

class App {
  private app: express.Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.middlewares();
    this.dbConnection().then(() => {
      this.routes();
    })
  }

  private async dbConnection() {
    const { MONGODB_URI, MONGODB_DBNAME } = process.env;

    if (MONGODB_URI === undefined) throw new Error('MONGODB_URI not defined.');
    if (MONGODB_DBNAME === undefined)
      throw new Error('MONGODB_DBNAME not defined.');

    const mongo = new MongoManager();
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
    this.app.get('/', async (request: Request, response: Response) => {
      response.send('Hello World!');
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const app: App = new App();

export default app.getApp();
