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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { ListAboutDto } from './dto/list-about.dto';

@ApiTags('About')
@ApiBearerAuth('JWT-auth')
@Controller('/api/v1/admin/about')
export class AboutController {
  private readonly logger = new Logger(AboutController.name);

  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @ApiOperation({
    summary: 'Create About',
  })
  async create(@Body() createAboutDto: CreateAboutDto) {
    this.logger.log('Create About API Called');
    return this.aboutService.create(createAboutDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get About List',
  })
  async findAll(@Query() listAboutDto: ListAboutDto) {
    this.logger.log('Get About List API Called');
    return this.aboutService.findAll(listAboutDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get About By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Get About By Id : ${id}`);
    return this.aboutService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update About',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAboutDto: UpdateAboutDto,
  ) {
    this.logger.log(`Update About : ${id}`);
    return this.aboutService.update(id, updateAboutDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Delete About',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Delete About : ${id}`);
    return this.aboutService.remove(id);
  }
}
