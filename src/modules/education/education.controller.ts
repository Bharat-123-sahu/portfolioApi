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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ListEducationDto } from './dto/list-education.dto';

@ApiTags('Education')
@ApiBearerAuth('JWT-auth')
@Controller('/api/v1/admin/education')
export class EducationController {
  private readonly logger = new Logger(EducationController.name);

  constructor(private readonly experienceService: EducationService) {}

  @Post()
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Create Education',
    description: 'Create a new education.',
  })
  @ApiResponse({
    status: 201,
    description: 'Education created successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() createEducationDto: CreateEducationDto) {
    this.logger.log('Create Education API Called');
    return this.experienceService.create(createEducationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Education List',
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
    description: 'Education list retrieved successfully.',
  })
  async findAll(@Query() listEducationDto: ListEducationDto) {
    this.logger.log('Get Education List API Called');
    return this.experienceService.findAll(listEducationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Education By Id',
    description: 'Retrieve education by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Education Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Education retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Education not found.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Education : ${id}`);
    return this.experienceService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update Education',
    description: 'Update an education.',
  })
  @ApiParam({
    name: 'id',
    description: 'Education Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Education updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Education not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    this.logger.log(`Update Education : ${id}`);
    return this.experienceService.update(id, updateEducationDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete Education',
    description: 'Delete education by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Education Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Education deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Education not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Education : ${id}`);
    return this.experienceService.remove(id);
  }
}
