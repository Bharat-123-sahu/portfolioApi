import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { ProjectModel } from 'src/@database/project.model';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectDto } from './dto/list.project.dto';
import { ProjectPreviewService } from './project-preview.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly projectPreviewService: ProjectPreviewService) {}

  async create(createProjectDto: CreateProjectDto) {
    const exists = await ProjectModel(mongoose.connection)
      .findOne({
        slug: createProjectDto.slug,
      })
      .select('_id')
      .lean();

    if (exists) {
      throw new HttpException('Project already exists.', HttpStatus.CONFLICT);
    }

    const preview =
      (await this.projectPreviewService.tryFetch(createProjectDto.liveDemoUrl)) ??
      this.projectPreviewService.empty();

    const project = await ProjectModel(mongoose.connection).create({
      ...createProjectDto,
      ...preview,
    });

    return {
      success: true,
      message: 'Project created successfully.',
      project: project,
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

    const [projects, total] = await Promise.all([
      ProjectModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .lean(),

      ProjectModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      projects,
    };
  }

  async findOne(id: string) {
    const project = await ProjectModel(mongoose.connection).findById(id).lean();

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      project: project,
    };
  }

  async findFeatured() {
    const projects = await ProjectModel(mongoose.connection)
      .find({ isActive: true, isFeatured: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      projects,
    };
  }

  async findActive() {
    const projects = await ProjectModel(mongoose.connection)
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      projects,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existing = await ProjectModel(mongoose.connection)
      .findById(id)
      .select('liveDemoUrl')
      .lean();

    if (!existing) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    const nextLiveDemoUrl = updateProjectDto.liveDemoUrl ?? existing.liveDemoUrl;
    const liveDemoChanged =
      updateProjectDto.liveDemoUrl !== undefined &&
      updateProjectDto.liveDemoUrl !== existing.liveDemoUrl;
    const previewPatch = liveDemoChanged
      ? (await this.projectPreviewService.tryFetch(nextLiveDemoUrl)) ??
        this.projectPreviewService.empty()
      : {};

    const project = await ProjectModel(mongoose.connection)
      .findByIdAndUpdate(
        id,
        {
          ...updateProjectDto,
          ...previewPatch,
        },
        {
          new: true,
        },
      )
      .lean();

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Project updated successfully.',
      project: project,
    };
  }

  async preview(url: string) {
    const preview = await this.projectPreviewService.fetch(url);

    return {
      success: true,
      preview,
    };
  }

  async remove(id: string) {
    const project = await ProjectModel(mongoose.connection)
      .findByIdAndDelete(id)
      .select('_id')
      .lean();

    if (!project) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Project deleted successfully.',
    };
  }
}
