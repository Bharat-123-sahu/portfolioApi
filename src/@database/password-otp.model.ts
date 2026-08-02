import { Connection, Schema } from 'mongoose';

export interface IPasswordOtp {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PasswordOtpSchema = new Schema<IPasswordOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

PasswordOtpSchema.index({ email: 1 }, { unique: true });

export const PasswordOtpModel = (connection: Connection) =>
  connection.model<IPasswordOtp>('PasswordOtp', PasswordOtpSchema);
