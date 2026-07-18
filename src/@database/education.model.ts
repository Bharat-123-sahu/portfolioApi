import { Connection, Schema } from 'mongoose';

export interface IEducation {
  instituteName: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startYear: number;
  endYear: number;
  grade: string;
  description: string;
  instituteLogo: string;
  displayOrder: number;
  isActive: boolean;
}

const EducationSchema = new Schema<IEducation>(
  {
    instituteName: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    startYear: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    instituteLogo: {
      type: String,
      default: '',
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

export const EducationModel = (connection: Connection) =>
  connection.model<IEducation>('Education', EducationSchema);