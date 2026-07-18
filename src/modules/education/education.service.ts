import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { EducationModel } from 'src/@database/education.model';

import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ListEducationDto } from './dto/list-education.dto';

@Injectable()
export class EducationService {
  private readonly logger = new Logger(EducationService.name);

  async create(createEducationDto: CreateEducationDto) {
    const education = await EducationModel(
      mongoose.connection,
    ).create(createEducationDto);

    return {
      success: true,
      message: 'Education created successfully.',
      data: education,
    };
  }

  async findAll(listEducationDto: ListEducationDto) {
    const page = Number(listEducationDto.page) || 1;
    const perPage = Number(listEducationDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listEducationDto.search
      ? {
          instituteName: {
            $regex: listEducationDto.search,
            $options: 'i',
          },
        }
      : {};

    const [data, total] = await Promise.all([
      EducationModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          displayOrder: 1,
          startYear: -1,
        }),

      EducationModel(mongoose.connection).countDocuments(
        searchFilter,
      ),
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
    const education = await EducationModel(
      mongoose.connection,
    ).findById(id);

    if (!education) {
      throw new HttpException(
        'Education not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data: education,
    };
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ) {
    const education = await EducationModel(
      mongoose.connection,
    ).findByIdAndUpdate(id, updateEducationDto, {
      new: true,
    });

    if (!education) {
      throw new HttpException(
        'Education not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Education updated successfully.',
      data: education,
    };
  }

  async remove(id: string) {
    const education = await EducationModel(
      mongoose.connection,
    ).findByIdAndDelete(id);

    if (!education) {
      throw new HttpException(
        'Education not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Education deleted successfully.',
    };
  }
}