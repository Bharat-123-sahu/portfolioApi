import { Connection, Schema } from 'mongoose';

export interface IExperience {
  companyName: string;
  designation: string;
  employmentType: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  currentlyWorking: boolean;
  companyLogo: string;
  description: string;
  technologies: string[];
  displayOrder: number;
  isActive: boolean;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      default: 'Full Time',
    },
    location: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
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

export const ExperienceModel = (connection: Connection) =>
  connection.model<IExperience>('Experience', ExperienceSchema);