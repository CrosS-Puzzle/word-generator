import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

class MongoManager {
  private connection: Mongoose | null;

  constructor() {
    this.connection = null;
  }

  public async connect(uri: string, options?: ConnectOptions) {
    try {
      mongoose.set('strictQuery', true);
      this.connection = await mongoose.connect(uri, { ...options });
      console.log('>> MongoDB connected.');
    } catch (error) {
      console.log('[ERROR_MONGO_CONNECT]', error);
    }
  }

  public async disconnect() {
    try {
      if (this.connection) {
        await this.connection.connection.close();
        console.log('>> MongoDB disconnected.');
      }
    } catch (error) {
      console.log('[ERROR_MONGO_DISCONNECT]', error);
    }
  }
}

export default MongoManager;
