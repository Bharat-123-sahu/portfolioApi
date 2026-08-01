import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { SocialLinkService } from './social-links.service';
import { ListSocialLinkDto } from './dto/list-social-links.dto';

@ApiTags('Social Link')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller(['api/v1/admin/social-links', 'social-link'])
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
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
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update Social Link' })
  update(@Param('id') id: string, @Body() dto: UpdateSocialLinkDto) {
    return this.socialLinkService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete Social Link' })
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(id);
  }
}
