import { Connection, Schema } from 'mongoose';

export interface IProject {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;

  category: string;
  technologies: string[];

  thumbnail: string;
  images: string[];

  githubUrl: string;
  liveDemoUrl: string;
  playStoreUrl: string;
  appStoreUrl: string;

  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    githubUrl: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    playStoreUrl: {
      type: String,
      default: '',
    },
    appStoreUrl: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
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

ProjectSchema.index({ displayOrder: 1, createdAt: -1 });
ProjectSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ updatedAt: -1 });

export const ProjectModel = (connection: Connection) =>
  connection.model<IProject>('Project', ProjectSchema);
