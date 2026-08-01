import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ResumeModel } from 'src/@database/resume.model';
import { ListResumeDto } from 'src/modules/admin/resume/dto/list-resume-dto';

@Injectable()
export class PublicResumeService {
  private readonly logger = new Logger(PublicResumeService.name);

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
        .sort({ createdAt: -1 })
        .lean(),

      ResumeModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      resumes,
    };
  }

  async findOne(id: string) {
    const resume = await ResumeModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!resume) {
      throw new HttpException(
        'Resume not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      resume,
    };
  }
}