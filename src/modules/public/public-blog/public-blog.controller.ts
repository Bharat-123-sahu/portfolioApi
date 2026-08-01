import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicBlogService } from './public-blog.service';
import { ListBlogDto } from 'src/modules/admin/blogs/dto/list-blog.dto';

@ApiTags('Public Blog')
@Controller('api/v1/public/blog')
export class PublicBlogController {
  private readonly logger = new Logger(PublicBlogController.name);

  constructor(
    private readonly blogService: PublicBlogService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Blog List',
  })
  async findAll(@Query() listBlogDto: ListBlogDto) {
    this.logger.log('Public Blog List');

    return this.blogService.findAll(listBlogDto);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get Blog By Slug',
  })
  async findBySlug(@Param('slug') slug: string) {
    this.logger.log(`Public Blog Slug ${slug}`);

    return this.blogService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Blog By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Blog ${id}`);

    return this.blogService.findOne(id);
  }
}
