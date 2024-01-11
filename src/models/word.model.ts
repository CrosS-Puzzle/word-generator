import mongoose from 'mongoose';

export interface IWord extends mongoose.Document {
  value: string;
  category: string;
  description: string;
}

const wordSchema = new mongoose.Schema<IWord>({
  value: {
    type: String,
    required: true,
  },
  category: {
    type: String,
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
  Word = mongoose.model<IWord>('Word', wordSchema);
}

export default Word;
