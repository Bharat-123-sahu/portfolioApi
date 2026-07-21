import { Connection, Schema } from 'mongoose';

export interface ICertificate {
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date | null;
  credentialId: string;
  credentialUrl: string;
  certificateImage: string;
  certificateFile: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    credentialId: {
      type: String,
      default: '',
      trim: true,
    },

    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },

    certificateImage: {
      type: String,
      default: '',
    },

    certificateFile: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
      trim: true,
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

CertificateSchema.index({ issuer: 1 });
CertificateSchema.index({ issueDate: -1 });
CertificateSchema.index({ displayOrder: 1 });
CertificateSchema.index({ isActive: 1 });

export const CertificateModel = (connection: Connection) =>
  connection.model<ICertificate>('Certificate', CertificateSchema);