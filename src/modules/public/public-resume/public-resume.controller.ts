import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicResumeService } from './public-resume.service';
import { ListResumeDto } from 'src/modules/admin/resume/dto/list-resume-dto';

@ApiTags('Public Resume')
@Controller('api/v1/public/resume')
export class PublicResumeController {
  private readonly logger = new Logger(PublicResumeController.name);

  constructor(
    private readonly resumeService: PublicResumeService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Resume List',
  })
  async findAll(@Query() listResumeDto: ListResumeDto) {
    this.logger.log('Public Resume List');

    return this.resumeService.findAll(listResumeDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Resume By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Resume ${id}`);

    return this.resumeService.findOne(id);
  }
}