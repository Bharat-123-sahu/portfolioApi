import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectDto } from './dto/list.project.dto';
import { PreviewProjectDto } from './dto/preview-project.dto';

@ApiTags('Project')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Project',
    description: 'Create a new project.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Project already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() createProjectDto: CreateProjectDto) {
    this.logger.log('Create Project API Called');
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Project List',
    description: 'Retrieve all projects.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Project list retrieved successfully.',
  })
  async findAll(@Query() listProjectDto: ListProjectDto) {
    this.logger.log('Get Project List API Called');
    return this.projectService.findAll(listProjectDto);
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Get Featured Projects',
    description: 'Retrieve active projects marked as featured.',
  })
  async findFeatured() {
    this.logger.log('Get Featured Projects API Called');
    return this.projectService.findFeatured();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get Active Projects',
    description: 'Retrieve active projects.',
  })
  async findActive() {
    this.logger.log('Get Active Projects API Called');
    return this.projectService.findActive();
  }

  @Get('preview')
  @ApiOperation({
    summary: 'Preview Project Live URL',
    description: 'Generate a Microlink website preview for a live demo URL.',
  })
  @ApiQuery({
    name: 'url',
    required: true,
  })
  async preview(@Query() previewProjectDto: PreviewProjectDto) {
    this.logger.log(`Preview Project URL : ${previewProjectDto.url}`);
    return this.projectService.preview(previewProjectDto.url);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Project By Id',
    description: 'Retrieve project by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Project By Id : ${id}`);
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Project',
    description: 'Update existing project.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    this.logger.log(`Update Project : ${id}`);
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Project',
    description: 'Delete project by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Project Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Project : ${id}`);
    return this.projectService.remove(id);
  }
}
