import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicHeroService } from './public-hero.service';
import { ListHeroDto } from 'src/modules/admin/hero/dto/list-hero.dto';

@ApiTags('Public Hero')
@Controller('api/v1/public/hero')
export class PublicHeroController {
  private readonly logger = new Logger(PublicHeroController.name);

  constructor(
    private readonly heroService: PublicHeroService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Hero List',
  })
  async findAll(@Query() listHeroDto: ListHeroDto) {
    this.logger.log('Public Hero List');

    return this.heroService.findAll(listHeroDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Hero By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Hero ${id}`);

    return this.heroService.findOne(id);
  }
}