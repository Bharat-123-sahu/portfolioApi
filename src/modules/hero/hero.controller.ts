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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { ListHeroDto } from './dto/list-hero.dto';

@ApiTags('Hero')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('/api/v1/admin/hero')
export class HeroController {
  private readonly logger = new Logger(HeroController.name);

  constructor(private readonly heroService: HeroService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Hero',
  })
  async create(@Body() createHeroDto: CreateHeroDto) {
    this.logger.log('Create Hero API called');
    return this.heroService.create(createHeroDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Heroes',
  })
  async findAll(@Query() listHeroDto: ListHeroDto) {
    this.logger.log('Get All Heroes API called');
    return this.heroService.findAll(listHeroDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Hero By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get Hero API called. Id: ${id}`);
    return this.heroService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Hero',
  })
  async update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    this.logger.log(`Update Hero API called. Id: ${id}`);
    return this.heroService.update(id, updateHeroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Hero',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete Hero API called. Id: ${id}`);
    return this.heroService.remove(id);
  }
}
