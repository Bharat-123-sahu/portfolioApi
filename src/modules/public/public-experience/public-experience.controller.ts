import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicExperienceService } from './public-experience.service';
import { ListExperienceDto } from 'src/modules/admin/experience/dto/list-experience.dto';

@ApiTags('Public Experience')
@Controller('api/v1/public/experience')
export class PublicExperienceController {
  private readonly logger = new Logger(PublicExperienceController.name);

  constructor(
    private readonly experienceService: PublicExperienceService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Experience List',
  })
  async findAll(@Query() listExperienceDto: ListExperienceDto) {
    this.logger.log('Public Experience List');

    return this.experienceService.findAll(listExperienceDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Experience By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Experience ${id}`);

    return this.experienceService.findOne(id);
  }
}