import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicAboutService } from './public-about.service';
import { ListAboutDto } from 'src/modules/admin/about/dto/list-about.dto';

@ApiTags('Public About')
@Controller('api/v1/public/about')
export class PublicAboutController {
  private readonly logger = new Logger(PublicAboutController.name);

  constructor(
    private readonly aboutService: PublicAboutService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get About List',
  })
  async findAll(@Query() listAboutDto: ListAboutDto) {
    this.logger.log('Public About List');

    return this.aboutService.findAll(listAboutDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get About By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public About ${id}`);

    return this.aboutService.findOne(id);
  }
}