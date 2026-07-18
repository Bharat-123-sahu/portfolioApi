import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ExperienceModel } from 'src/@database/experience.model';

import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ListExperienceDto } from './dto/list-experience.dto';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  async create(createExperienceDto: CreateExperienceDto) {
    const experience = await ExperienceModel(mongoose.connection).create(
      createExperienceDto,
    );

    return {
      success: true,
      message: 'Experience created successfully.',
      data: experience,
    };
  }

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

    const [data, total] = await Promise.all([
      ExperienceModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          displayOrder: 1,
          startDate: -1,
        }),

      ExperienceModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      data,
    };
  }

  async findOne(id: string) {
    const experience = await ExperienceModel(mongoose.connection).findById(id);

    if (!experience) {
      throw new HttpException('Experience not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      data: experience,
    };
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const experience = await ExperienceModel(
      mongoose.connection,
    ).findByIdAndUpdate(id, updateExperienceDto, {
      new: true,
    });

    if (!experience) {
      throw new HttpException('Experience not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Experience updated successfully.',
      data: experience,
    };
  }

  async remove(id: string) {
    const experience = await ExperienceModel(
      mongoose.connection,
    ).findByIdAndDelete(id);

    if (!experience) {
      throw new HttpException('Experience not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Experience deleted successfully.',
    };
  }
}
