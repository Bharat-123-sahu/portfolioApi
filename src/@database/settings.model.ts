import { Connection, Schema } from 'mongoose';

export interface ISettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];

  siteAuthor: string;

  logo: string;
  favicon: string;

  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  defaultResume: string;

  contactEmail: string;
  supportEmail: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];

  googleAnalyticsId: string;
  googleTagManagerId: string;

  maintenanceMode: boolean;

  enableBlog: boolean;
  enableProjects: boolean;
  enableContactForm: boolean;

  isActive: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteTitle: {
      type: String,
      required: true,
      trim: true,
    },

    siteDescription: {
      type: String,
      default: '',
      trim: true,
    },

    siteKeywords: {
      type: [String],
      default: [],
    },

    siteAuthor: {
      type: String,
      default: '',
      trim: true,
    },

    logo: {
      type: String,
      default: '',
    },

    favicon: {
      type: String,
      default: '',
    },

    primaryColor: {
      type: String,
      default: '#3880ff',
    },

    secondaryColor: {
      type: String,
      default: '#5260ff',
    },

    accentColor: {
      type: String,
      default: '#2dd36f',
    },

    defaultResume: {
      type: String,
      default: '',
    },

    contactEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },

    supportEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },

    phone: {
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

    metaTitle: {
      type: String,
      default: '',
      trim: true,
    },

    metaDescription: {
      type: String,
      default: '',
      trim: true,
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    googleAnalyticsId: {
      type: String,
      default: '',
      trim: true,
    },

    googleTagManagerId: {
      type: String,
      default: '',
      trim: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    enableBlog: {
      type: Boolean,
      default: true,
    },

    enableProjects: {
      type: Boolean,
      default: true,
    },

    enableContactForm: {
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

SettingsSchema.index({ isActive: 1 });
SettingsSchema.index({ siteTitle: 1 });
SettingsSchema.index({ isActive: 1, createdAt: -1 });
SettingsSchema.index({ createdAt: -1 });

export const SettingsModel = (connection: Connection) =>
  connection.model<ISettings>('Settings', SettingsSchema);
