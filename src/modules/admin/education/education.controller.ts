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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ListEducationDto } from './dto/list-education.dto';

@ApiTags('Education')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/education')
export class EducationController {
  private readonly logger = new Logger(EducationController.name);

  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
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
    return this.educationService.create(createEducationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Education List',
    description: 'Retrieve all education records.',
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
    return this.educationService.findAll(listEducationDto);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get Active Education',
    description: 'Retrieve active education records.',
  })
  async findActive() {
    this.logger.log('Get Active Education API Called');
    return this.educationService.findActive();
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
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
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
    return this.educationService.update(id, updateEducationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
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
    return this.educationService.remove(id);
  }
}
