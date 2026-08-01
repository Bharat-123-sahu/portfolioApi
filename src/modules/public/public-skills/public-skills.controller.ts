import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicSkillsService } from './public-skills.service';
import { ListSkillDto } from 'src/modules/admin/skills/dto/list-skills.dto';

@ApiTags('Public Skills')
@Controller('api/v1/public/skills')
export class PublicSkillsController {
  private readonly logger = new Logger(PublicSkillsController.name);

  constructor(
    private readonly skillsService: PublicSkillsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Skills List',
  })
  async findAll(@Query() listSkillDto: ListSkillDto) {
    this.logger.log('Public Skills List');

    return this.skillsService.findAll(listSkillDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Skill By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Skill ${id}`);

    return this.skillsService.findOne(id);
  }
}