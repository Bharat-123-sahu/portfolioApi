import { Connection, Schema } from 'mongoose';

export interface IUser {
  _id?: unknown;

  name: string;

  email: string;

  password: string;

  role: string;

  isActive: boolean;

  refreshTokenHash?: string;

  refreshTokenExpiresAt?: Date;

  passwordResetTokenHash?: string;

  passwordResetExpiresAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'admin',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = (connection: Connection) =>
  connection.model<IUser>('User', UserSchema);
