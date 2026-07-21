import { Connection, Schema } from 'mongoose';

export interface IContact {
  name: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  googleMapUrl: string;
  profileImage: string;
  resumeUrl: string;
  workingHours: string;
  availableForHire: boolean;
  displayOrder: number;
  isActive: boolean;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: '',
      trim: true,
    },

    website: {
      type: String,
      default: '',
      trim: true,
    },

    address: {
      type: String,
      default: '',
      trim: true,
    },

    city: {
      type: String,
      default: '',
      trim: true,
    },

    state: {
      type: String,
      default: '',
      trim: true,
    },

    country: {
      type: String,
      default: '',
      trim: true,
    },

    postalCode: {
      type: String,
      default: '',
      trim: true,
    },

    googleMapUrl: {
      type: String,
      default: '',
      trim: true,
    },

    profileImage: {
      type: String,
      default: '',
    },

    resumeUrl: {
      type: String,
      default: '',
    },

    workingHours: {
      type: String,
      default: '',
      trim: true,
    },

    availableForHire: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
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

ContactSchema.index({ email: 1 }, { unique: true });
ContactSchema.index({ phone: 1 });
ContactSchema.index({ availableForHire: 1 });
ContactSchema.index({ displayOrder: 1 });
ContactSchema.index({ isActive: 1 });

export const ContactModel = (connection: Connection) =>
  connection.model<IContact>('Contact', ContactSchema);