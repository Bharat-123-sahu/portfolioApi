import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicSettingsService } from './public-settings.service';

@ApiTags('Public Settings')
@Controller('api/v1/public/settings')
export class PublicSettingsController {
  private readonly logger = new Logger(PublicSettingsController.name);

  constructor(private readonly settingsService: PublicSettingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Active Public Settings',
  })
  async findActive() {
    this.logger.log('Public Settings Details');
    return this.settingsService.findActive();
  }
}
