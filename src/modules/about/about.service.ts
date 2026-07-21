import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { AboutModel } from 'src/@database/about.model';

import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { ListAboutDto } from './dto/list-about.dto';

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  async create(createAboutDto: CreateAboutDto) {
    const about = await AboutModel(mongoose.connection).findOne({
      heading: createAboutDto.heading,
    });

    if (about) {
      throw new HttpException('About already exists.', HttpStatus.CONFLICT);
    }

    const aboutData = await AboutModel(mongoose.connection).create(
      createAboutDto,
    );

    return {
      success: true,
      message: 'About created successfully.',
      about: aboutData,
    };
  }

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
        .sort({ createdAt: -1 }),

      AboutModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      abouts,
    };
  }

  async findOne(id: string) {
    const about = await AboutModel(mongoose.connection).findById(id);

    if (!about) {
      throw new HttpException('About not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      about: about,
    };
  }

  async update(id: string, updateAboutDto: UpdateAboutDto) {
    const about = await AboutModel(mongoose.connection).findByIdAndUpdate(
      id,
      updateAboutDto,
      {
        new: true,
      },
    );

    if (!about) {
      throw new HttpException('About not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'About updated successfully.',
      about: about,
    };
  }

  async remove(id: string) {
    const about = await AboutModel(mongoose.connection).findByIdAndDelete(id);

    if (!about) {
      throw new HttpException('About not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'About deleted successfully.',
    };
  }
}
