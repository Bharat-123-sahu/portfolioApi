
import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicProjectsService } from './public-projects.service';
import { ListProjectDto } from 'src/modules/admin/projects/dto/list.project.dto';

@ApiTags('Public Projects')
@Controller('api/v1/public/projects')
export class PublicProjectsController {
  private readonly logger = new Logger(PublicProjectsController.name);

  constructor(
    private readonly projectsService: PublicProjectsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Project List',
  })
  async findAll(@Query() listProjectDto: ListProjectDto) {
    this.logger.log('Public Project List');

    return this.projectsService.findAll(listProjectDto);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get Project By Slug',
  })
  async findBySlug(@Param('slug') slug: string) {
    this.logger.log(`Public Project Slug ${slug}`);

    return this.projectsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Project By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Project ${id}`);

    return this.projectsService.findOne(id);
  }
}
