import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { AboutModel } from 'src/@database/about.model';
import { ListAboutDto } from 'src/modules/admin/about/dto/list-about.dto';

@Injectable()
export class PublicAboutService {
  private readonly logger = new Logger(PublicAboutService.name);

  async findAll(listAboutDto: ListAboutDto) {
    const page = Number(listAboutDto.page) || 1;
    const perPage = Number(listAboutDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listAboutDto.search
      ? {
          heading: {
            $regex: listAboutDto.search,
            $options: 'i',
          },
        }
      : {};

    const [abouts, total] = await Promise.all([
      AboutModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      AboutModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      abouts,
    };
  }

  async findOne(id: string) {
    const about = await AboutModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!about) {
      throw new HttpException(
        'About not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      about,
    };
  }
}