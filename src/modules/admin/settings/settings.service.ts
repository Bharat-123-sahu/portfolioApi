import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { SettingsModel } from 'src/@database/settings.model';

import { ListSettingsDto } from './dto/list-settings.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateSettingsDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  async create(createSettingsDto: CreateSettingsDto) {
    const settings = await SettingsModel(mongoose.connection)
      .findOne({
        siteTitle: createSettingsDto.siteTitle,
      })
      .select('_id')
      .lean();

    if (settings) {
      throw new HttpException('Settings already exists.', HttpStatus.CONFLICT);
    }

    const settingsData = await SettingsModel(mongoose.connection).create(
      createSettingsDto,
    );

    return {
      success: true,
      message: 'Settings created successfully.',
      settings: settingsData,
    };
  }

  async findAll(listSettingsDto: ListSettingsDto) {
    const page = Number(listSettingsDto.page) || 1;
    const perPage = Number(listSettingsDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter: any = {};

    if (listSettingsDto.isActive !== undefined) {
      filter.isActive = listSettingsDto.isActive;
    }

    const [settings, total] = await Promise.all([
      SettingsModel(mongoose.connection)
        .find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      SettingsModel(mongoose.connection).countDocuments(filter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      settings,
    };
  }

  async findOne(id: string) {
    const settings = await SettingsModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!settings) {
      throw new HttpException('Settings not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      settings,
    };
  }

  async update(updateSettingsDto: UpdateSettingDto) {
    const currentSettings = await SettingsModel(mongoose.connection)
      .findOne({})
      .sort({ isActive: -1, createdAt: -1 })
      .select('_id')
      .lean();

    if (!currentSettings) {
      const settings = await SettingsModel(mongoose.connection).create(
        updateSettingsDto,
      );

      return {
        success: true,
        message: 'Settings created successfully.',
        settings,
      };
    }

    return this.updateById(String(currentSettings._id), updateSettingsDto);
  }

  async updateById(id: string, updateSettingsDto: UpdateSettingDto) {
    const settings = await SettingsModel(mongoose.connection)
      .findByIdAndUpdate(id, updateSettingsDto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!settings) {
      throw new HttpException('Settings not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Settings updated successfully.',
      settings,
    };
  }

  async remove(id: string) {
    const settings = await SettingsModel(mongoose.connection)
      .findByIdAndDelete(id)
      .select('_id')
      .lean();

    if (!settings) {
      throw new HttpException('Settings not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Settings deleted successfully.',
    };
  }
}
