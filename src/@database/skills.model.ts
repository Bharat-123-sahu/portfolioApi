import { Connection, Schema } from 'mongoose';

export interface ISkill {
  name: string;
  slug: string;
  category: string;
  icon: string;
  percentage: number;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
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

SkillSchema.index({ slug: 1 }, { unique: true });
SkillSchema.index({ displayOrder: 1, createdAt: -1 });
SkillSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });
SkillSchema.index({ name: 1 });
SkillSchema.index({ updatedAt: -1 });

export const SkillModel = (connection: Connection) =>
  connection.model<ISkill>('Skill', SkillSchema);
