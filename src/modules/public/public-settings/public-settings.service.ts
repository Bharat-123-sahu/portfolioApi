import { Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { SettingsModel } from 'src/@database/settings.model';

@Injectable()
export class PublicSettingsService {
  private readonly logger = new Logger(PublicSettingsService.name);

  async findActive() {
    const settings = await SettingsModel(mongoose.connection)
      .findOne({ isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      settings,
    };
  }
}
