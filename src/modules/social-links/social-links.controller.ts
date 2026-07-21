import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { SocialLinkService } from './social-links.service';
import { ListSocialLinkDto } from './dto/list-social-links.dto';

@ApiTags('Social Link')
@ApiBearerAuth()
@Controller('social-link')
export class SocialLinkController {
  constructor(
    private readonly socialLinkService: SocialLinkService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Social Link' })
  @ApiResponse({
    status: 201,
    description: 'Social link created successfully.',
  })
  create(@Body() dto: CreateSocialLinkDto) {
    return this.socialLinkService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Social Link List' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isVisible', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() dto: ListSocialLinkDto) {
    return this.socialLinkService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Social Link Details' })
  findOne(@Param('id') id: string) {
    return this.socialLinkService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Social Link' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSocialLinkDto,
  ) {
    return this.socialLinkService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Social Link' })
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(id);
  }
}