import { Connection, Schema } from 'mongoose';

export interface IAbout {
  heading: string;
  subHeading: string;
  description: string;
  profileImage: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  totalCertificates: number;
  resumeUrl: string;
  isActive: boolean;
}

const AboutSchema = new Schema<IAbout>(
  {
    heading: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    totalProjects: {
      type: Number,
      default: 0,
    },
    totalClients: {
      type: Number,
      default: 0,
    },
    totalCertificates: {
      type: Number,
      default: 0,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AboutModel = (connection: Connection) =>
  connection.model<IAbout>('About', AboutSchema);