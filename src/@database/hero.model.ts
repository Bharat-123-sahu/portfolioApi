import { Connection, Schema } from 'mongoose';

export interface IHero {
  title: string;
  subtitle: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  location: string;
  isActive: boolean;
}

const HeroSchema = new Schema<IHero>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

HeroSchema.index({ title: 1 });
HeroSchema.index({ isActive: 1, createdAt: -1 });
HeroSchema.index({ createdAt: -1 });

export const HeroModel = (connection: Connection) =>
  connection.model<IHero>('Hero', HeroSchema);
