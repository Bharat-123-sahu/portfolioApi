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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ListExperienceDto } from './dto/list-experience.dto';

@ApiTags('Experience')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/experience')
export class ExperienceController {
  private readonly logger = new Logger(ExperienceController.name);

  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Experience',
    description: 'Create a new experience.',
  })
  @ApiResponse({
    status: 201,
    description: 'Experience created successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() createExperienceDto: CreateExperienceDto) {
    this.logger.log('Create Experience API Called');
    return this.experienceService.create(createExperienceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Experience List',
    description: 'Retrieve all experiences.',
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
    description: 'Experience list retrieved successfully.',
  })
  async findAll(@Query() listExperienceDto: ListExperienceDto) {
    this.logger.log('Get Experience List API Called');
    return this.experienceService.findAll(listExperienceDto);
  }

  @Get('current')
  @ApiOperation({
    summary: 'Get Current Experience',
    description: 'Retrieve active experiences marked as current.',
  })
  async findCurrent() {
    this.logger.log('Get Current Experience API Called');
    return this.experienceService.findCurrent();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get Active Experiences',
    description: 'Retrieve active experiences.',
  })
  async findActive() {
    this.logger.log('Get Active Experiences API Called');
    return this.experienceService.findActive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Experience By Id',
    description: 'Retrieve experience by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Experience retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience not found.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Experience : ${id}`);
    return this.experienceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Experience',
    description: 'Update an experience.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Experience updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    this.logger.log(`Update Experience : ${id}`);
    return this.experienceService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Experience',
    description: 'Delete experience by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Experience Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Experience deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Experience : ${id}`);
    return this.experienceService.remove(id);
  }
}
