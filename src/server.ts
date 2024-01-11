import http from 'http';
import { Application, RequestHandler } from 'express';
import { ConnectOptions } from 'mongoose';

import Controller from './controllers/controller';
import MongoConfig from './mongoose.config';
import { MONGODB_DBNAME, MONGODB_URI } from './config';

export class Server {
  private app: Application;
  private readonly port: number;

  constructor(app: Application, port: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`>> Running on port ${this.port}`);
    });
  }

  public loadGlobalMiddleware(middleware: Array<RequestHandler>): void {
    // global stuff like cors, body-parser, etc
    middleware.forEach((mw) => {
      this.app.use(mw);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      // use setRoutes method that maps routes and returns Router object
      this.app.use(controller.path, controller.setRoutes());
    });
  }

  public async initDatabase(): Promise<void> {
    const mongo = new MongoConfig();
    const dbOptions: ConnectOptions = {
      dbName: MONGODB_DBNAME,
    };
    await mongo.connect(MONGODB_URI, dbOptions);
  }
}
