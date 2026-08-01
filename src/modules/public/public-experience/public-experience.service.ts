import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ExperienceModel } from 'src/@database/experience.model';
import { ListExperienceDto } from 'src/modules/admin/experience/dto/list-experience.dto';

@Injectable()
export class PublicExperienceService {
  private readonly logger = new Logger(PublicExperienceService.name);

  async findAll(listExperienceDto: ListExperienceDto) {
    const page = Number(listExperienceDto.page) || 1;
    const perPage = Number(listExperienceDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listExperienceDto.search
      ? {
          companyName: {
            $regex: listExperienceDto.search,
            $options: 'i',
          },
        }
      : {};

    const [experiences, total] = await Promise.all([
      ExperienceModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      ExperienceModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      experiences,
    };
  }

  async findOne(id: string) {
    const experience = await ExperienceModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!experience) {
      throw new HttpException(
        'Experience not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      experience,
    };
  }
}