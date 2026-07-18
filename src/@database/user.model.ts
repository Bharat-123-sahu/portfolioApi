import { Connection, Schema } from 'mongoose';

export interface IUser {
  name: string;

  email: string;

  password: string;

  role: string;

  isActive: boolean;

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
  },
  {
    timestamps: true,
  },
);

export const UserModel = (connection: Connection) =>
  connection.model<IUser>('User', UserSchema);
