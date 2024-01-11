import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT_NUM!) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const MONGODB_DBNAME = process.env.MONGODB_DBNAME!;
export const OPENAI_API_KEY = process.env.OPEN_AI_API_KEY!;
