import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ResumeModel } from 'src/@database/resume.model';

import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ListResumeDto } from './dto/list-resume-dto';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  async create(createResumeDto: CreateResumeDto) {
    if (createResumeDto.isDefault) {
      await ResumeModel(mongoose.connection).updateMany(
        { isDefault: true },
        {
          isDefault: false,
        },
      );
    }

    const resume = await ResumeModel(mongoose.connection).create(
      createResumeDto,
    );

    return {
      success: true,
      message: 'Resume created successfully.',
      resume: resume,
    };
  }

  async findAll(listResumeDto: ListResumeDto) {
    const page = Number(listResumeDto.page) || 1;
    const perPage = Number(listResumeDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listResumeDto.search
      ? {
          title: {
            $regex: listResumeDto.search,
            $options: 'i',
          },
        }
      : {};

    const [resumes, total] = await Promise.all([
      ResumeModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          createdAt: -1,
        })
        .lean(),

      ResumeModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      resumes,
    };
  }

  async findOne(id: string) {
    const resume = await ResumeModel(mongoose.connection).findById(id).lean();

    if (!resume) {
      throw new HttpException('Resume not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      resume: resume,
    };
  }

  async findDefault() {
    const resume = await ResumeModel(mongoose.connection)
      .findOne({
        isDefault: true,
        isActive: true,
      })
      .lean();

    if (!resume) {
      throw new HttpException('Default resume not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      resume,
    };
  }

  async update(id: string, updateResumeDto: UpdateResumeDto) {
    if (updateResumeDto.isDefault) {
      await ResumeModel(mongoose.connection).updateMany(
        { _id: { $ne: id }, isDefault: true },
        {
          isDefault: false,
        },
      );
    }

    const resume = await ResumeModel(mongoose.connection)
      .findByIdAndUpdate(id, updateResumeDto, {
        new: true,
      })
      .lean();

    if (!resume) {
      throw new HttpException('Resume not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Resume updated successfully.',
      resume: resume,
    };
  }

  async remove(id: string) {
    const resume = await ResumeModel(mongoose.connection)
      .findByIdAndDelete(id)
      .select('_id')
      .lean();

    if (!resume) {
      throw new HttpException('Resume not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Resume deleted successfully.',
    };
  }
}
