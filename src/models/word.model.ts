import mongoose from 'mongoose';

import { Category } from '../types/category';

interface IUser {
  value: string;
  category: Category;
  description: string;
}

const wordSchema = new mongoose.Schema<IUser>({
  value: {
    type: String,
    required: true,
  },
  category: {
    type: Category,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

let Word: any = null;

if (mongoose.models.Word !== undefined) {
  Word = mongoose.models.Word;
} else {
  Word = mongoose.model<IUser>('Word', wordSchema);
}

export default Word;
