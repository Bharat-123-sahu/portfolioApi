import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicEducationService } from './public-education.service';
import { ListEducationDto } from 'src/modules/admin/education/dto/list-education.dto';

@ApiTags('Public Education')
@Controller('api/v1/public/education')
export class PublicEducationController {
  private readonly logger = new Logger(PublicEducationController.name);

  constructor(
    private readonly educationService: PublicEducationService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Education List',
  })
  async findAll(@Query() listEducationDto: ListEducationDto) {
    this.logger.log('Public Education List');

    return this.educationService.findAll(listEducationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Education By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Education ${id}`);

    return this.educationService.findOne(id);
  }
}