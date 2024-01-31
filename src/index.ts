import express, { RequestHandler, json, urlencoded } from 'express';
import { Server } from './server';
import Controller from './controllers/controller';
import cors from 'cors';
import { PORT } from './config';
import { WordController } from './controllers/word/word.controller';

const port: number = PORT;

const app = express();
const server = new Server(app, port);

const controllers: Array<Controller> = [
  new WordController(),
];

const globalMiddleware: Array<RequestHandler> = [
  urlencoded({ extended: true, limit: '50mb' }),
  json(),
  cors(),
];

Promise.resolve().then(() => {
  server.initDatabase().then(() => {
    server.loadGlobalMiddleware(globalMiddleware);
    server.loadControllers(controllers);
    server.run();
  });
});
