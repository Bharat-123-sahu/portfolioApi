import { Connection, Schema } from 'mongoose';

export interface IResume {
  title: string;
  fileName: string;
  fileUrl: string;
  version: string;
  isDefault: boolean;
  isActive: boolean;
}

const ResumeSchema = new Schema<IResume>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      default: '1.0',
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ResumeModel = (connection: Connection) =>
  connection.model<IResume>('Resume', ResumeSchema);