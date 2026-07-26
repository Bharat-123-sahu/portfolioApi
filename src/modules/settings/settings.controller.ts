import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { ListSettingsDto } from './dto/list-settings.dto';
import { CreateSettingsDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create Settings' })
  @ApiResponse({
    status: 201,
    description: 'Settings created successfully.',
  })
  create(@Body() dto: CreateSettingsDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Settings List' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() dto: ListSettingsDto) {
    return this.settingsService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Settings Details' })
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update Settings' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSettingDto,
  ) {
    return this.settingsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete Settings' })
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id);
  }
}
