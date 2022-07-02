import { model, Schema } from 'mongoose';

interface IFile {
  path: string;
  originalName: string;
  password?: string;
  downloadCounter: number;
}

const fileSchema = new Schema<IFile>({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  password: String,
  downloadCounter: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const File = model<IFile>('File', fileSchema);
