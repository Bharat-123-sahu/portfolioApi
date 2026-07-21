import { Connection, Schema } from 'mongoose';

export interface ISocialLink {
  platform: string;
  username: string;
  url: string;
  icon: string;
  color: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        'linkedin',
        'github',
        'x',
        'instagram',
        'facebook',
        'youtube',
        'leetcode',
        'hackerrank',
        'stackoverflow',
        'medium',
        'devto',
        'portfolio',
      ],
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: '',
      trim: true,
    },

    color: {
      type: String,
      default: '',
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    isVisible: {
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

SocialLinkSchema.index({ platform: 1 });
SocialLinkSchema.index({ displayOrder: 1 });
SocialLinkSchema.index({ isVisible: 1 });
SocialLinkSchema.index({ isActive: 1 });

export const SocialLinkModel = (connection: Connection) =>
  connection.model<ISocialLink>('SocialLink', SocialLinkSchema);