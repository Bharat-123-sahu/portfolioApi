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
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';
import { ListSkillDto } from './dto/list-skills.dto';

@ApiTags('Skill')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/skills')
export class SkillsController {
  private readonly logger = new Logger(SkillsController.name);

  constructor(private readonly skillService: SkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Skill',
    description: 'Create a new skill.',
  })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Skill already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() createSkillDto: CreateSkillDto) {
    this.logger.log('Create Skill API Called');
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Skill List',
    description: 'Retrieve all skills.',
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
    description: 'Skill list retrieved successfully.',
  })
  async findAll(@Query() listSkillDto: ListSkillDto) {
    this.logger.log('Get Skill List API Called');
    return this.skillService.findAll(listSkillDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Skill By Id',
    description: 'Retrieve skill by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Skill Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Skill By Id : ${id}`);
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Skill',
    description: 'Update existing skill.',
  })
  @ApiParam({
    name: 'id',
    description: 'Skill Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    this.logger.log(`Update Skill : ${id}`);
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Skill',
    description: 'Delete skill by id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Skill Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Skill : ${id}`);
    return this.skillService.remove(id);
  }
}
