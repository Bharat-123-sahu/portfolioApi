import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicSocialLinksService } from './public-social-links.service';
import { ListSocialLinkDto } from 'src/modules/admin/social-links/dto/list-social-links.dto';

@ApiTags('Public Social Links')
@Controller('api/v1/public/social-links')
export class PublicSocialLinksController {
  private readonly logger = new Logger(PublicSocialLinksController.name);

  constructor(
    private readonly socialLinksService: PublicSocialLinksService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Social Links List',
  })
  async findAll(@Query() listSocialLinkDto: ListSocialLinkDto) {
    this.logger.log('Public Social Links List');

    return this.socialLinksService.findAll(listSocialLinkDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Social Link By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Social Link ${id}`);

    return this.socialLinksService.findOne(id);
  }
}