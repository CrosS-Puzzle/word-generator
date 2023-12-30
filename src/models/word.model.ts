import mongoose from 'mongoose';

import { Category } from '../types/category';

const wordSchema = new mongoose.Schema({
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
  Word = mongoose.model('Word', wordSchema);
}

export default Word;
