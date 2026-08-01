import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ProjectModel } from 'src/@database/project.model';
import { ListProjectDto } from 'src/modules/admin/projects/dto/list.project.dto';

@Injectable()
export class PublicProjectsService {
  private readonly logger = new Logger(PublicProjectsService.name);

  async findAll(listProjectDto: ListProjectDto) {
    const page = Number(listProjectDto.page) || 1;
    const perPage = Number(listProjectDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listProjectDto.search
      ? {
          title: {
            $regex: listProjectDto.search,
            $options: 'i',
          },
        }
      : {};

    const [projects, total] = await Promise.all([
      ProjectModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      ProjectModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      projects,
    };
  }

  async findOne(id: string) {
    const project = await ProjectModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!project) {
      throw new HttpException(
        'Project not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      project,
    };
  }

  async findBySlug(slug: string) {
    const project = await ProjectModel(mongoose.connection)
      .findOne({ slug: slug.toLowerCase(), isActive: { $ne: false } })
      .lean();

    if (!project) {
      throw new HttpException(
        'Project not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      project,
    };
  }
}
