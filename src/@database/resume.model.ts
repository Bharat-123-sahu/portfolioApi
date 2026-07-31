import { Connection, Schema } from 'mongoose';

export interface IResume {
  title: string;
  resumeFile: string;
  version: string;
  description?: string;
  displayOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

const ResumeSchema = new Schema<IResume>(
  {
    title: {
      type: String,
      required: true,
    },

    resumeFile: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: '1.0',
    },

    description: {
      type: String,
      default: '',
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isDefault: {
      type: Boolean,
      default: false,
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

ResumeSchema.index({ createdAt: -1 });
ResumeSchema.index({ isDefault: 1 });
ResumeSchema.index({ isActive: 1, createdAt: -1 });
ResumeSchema.index({ title: 1 });

export const ResumeModel = (connection: Connection) =>
  connection.model<IResume>('Resume', ResumeSchema);
