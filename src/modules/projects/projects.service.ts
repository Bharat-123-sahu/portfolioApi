import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { ProjectModel } from 'src/@database/project.model';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectDto } from './dto/list.project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  async create(createProjectDto: CreateProjectDto) {
    const exists = await ProjectModel(mongoose.connection).findOne({
      slug: createProjectDto.slug,
    });

    if (exists) {
      throw new HttpException(
        'Project already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const project = await ProjectModel(
      mongoose.connection,
    ).create(createProjectDto);

    return {
      success: true,
      message: 'Project created successfully.',
      data: project,
    };
  }

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

    const [data, total] = await Promise.all([
      ProjectModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        }),

      ProjectModel(mongoose.connection).countDocuments(searchFilter),
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
    const project = await ProjectModel(
      mongoose.connection,
    ).findById(id);

    if (!project) {
      throw new HttpException(
        'Project not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data: project,
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await ProjectModel(
      mongoose.connection,
    ).findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });

    if (!project) {
      throw new HttpException(
        'Project not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Project updated successfully.',
      data: project,
    };
  }

  async remove(id: string) {
    const project = await ProjectModel(
      mongoose.connection,
    ).findByIdAndDelete(id);

    if (!project) {
      throw new HttpException(
        'Project not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Project deleted successfully.',
    };
  }
}