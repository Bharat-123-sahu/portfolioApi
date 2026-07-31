import { Connection, Schema } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  gallery: string[];
  tags: string[];
  category: string;
  author: string;
  publishedDate: Date;
  readingTime: number;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  displayOrder: number;
  isPublished: boolean;
  isActive: boolean;
}

const BlogSchema = new Schema<IBlog>(
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
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      default: '',
    },

    gallery: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: '',
    },

    author: {
      type: String,
      default: 'Admin',
    },

    publishedDate: {
      type: Date,
      default: Date.now,
    },

    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },

    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isPublished: {
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

BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ isFeatured: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ displayOrder: 1 });
BlogSchema.index({ displayOrder: 1, createdAt: -1 });
BlogSchema.index({
  isPublished: 1,
  isActive: 1,
  displayOrder: 1,
  createdAt: -1,
});
BlogSchema.index({ category: 1, displayOrder: 1, createdAt: -1 });
BlogSchema.index({ updatedAt: -1 });

export const BlogModel = (connection: Connection) =>
  connection.model<IBlog>('Blog', BlogSchema);
