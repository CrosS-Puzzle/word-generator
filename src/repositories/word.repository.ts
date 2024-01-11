import mongoose from 'mongoose';
import Word, { IWord } from '../models/word.model';

export class WordRepository {
  private wordModel: mongoose.Model<any>;

  constructor() {
    this.wordModel = Word;
  }

  async create(word: IWord) {
    return await this.wordModel.create<IWord>(word);
  }

  async createMany(words: IWord[]) {
    return await this.wordModel.insertMany<IWord>(words);
  }
}
