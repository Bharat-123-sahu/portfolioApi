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
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ListResumeDto } from './dto/list-resume-dto';

@ApiTags('Resume')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/resumes')
export class ResumeController {
  private readonly logger = new Logger(ResumeController.name);

  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Resume',
    description: 'Create a new resume.',
  })
  @ApiResponse({
    status: 201,
    description: 'Resume created successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() createResumeDto: CreateResumeDto) {
    this.logger.log('Create Resume API Called');
    return this.resumeService.create(createResumeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Resume List',
    description: 'Retrieve all resumes.',
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
    description: 'Resume list retrieved successfully.',
  })
  async findAll(@Query() listResumeDto: ListResumeDto) {
    this.logger.log('Get Resume List API Called');
    return this.resumeService.findAll(listResumeDto);
  }

  @Get('default')
  @ApiOperation({
    summary: 'Get Default Resume',
    description: 'Retrieve the active default resume.',
  })
  @ApiResponse({
    status: 200,
    description: 'Default resume retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Default resume not found.',
  })
  async findDefault() {
    this.logger.log('Get Default Resume API Called');
    return this.resumeService.findDefault();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Resume By Id',
    description: 'Retrieve resume by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Resume Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Resume By Id : ${id}`);
    return this.resumeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Resume',
    description: 'Update existing resume.',
  })
  @ApiParam({
    name: 'id',
    description: 'Resume Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    this.logger.log(`Update Resume : ${id}`);
    return this.resumeService.update(id, updateResumeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Resume',
    description: 'Delete resume by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Resume Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Resume : ${id}`);
    return this.resumeService.remove(id);
  }
}
