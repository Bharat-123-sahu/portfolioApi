import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { EducationModel } from 'src/@database/education.model';
import { ListEducationDto } from 'src/modules/admin/education/dto/list-education.dto';

@Injectable()
export class PublicEducationService {
  private readonly logger = new Logger(PublicEducationService.name);

  async findAll(listEducationDto: ListEducationDto) {
    const page = Number(listEducationDto.page) || 1;
    const perPage = Number(listEducationDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listEducationDto.search
      ? {
          degree: {
            $regex: listEducationDto.search,
            $options: 'i',
          },
        }
      : {};

    const [educations, total] = await Promise.all([
      EducationModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      EducationModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      educations,
    };
  }

  async findOne(id: string) {
    const education = await EducationModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!education) {
      throw new HttpException(
        'Education not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      education,
    };
  }
}