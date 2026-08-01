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
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ListBlogDto } from './dto/list-blog.dto';
import { BlogService } from './blogs.service';

@ApiTags('Blog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller(['api/v1/admin/blogs', 'blog'])
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Blog',
  })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully.',
  })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Blog List',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'category',
    required: false,
  })
  @ApiQuery({
    name: 'isPublished',
    required: false,
  })
  @ApiQuery({
    name: 'isFeatured',
    required: false,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
  })
  findAll(@Query() listBlogDto: ListBlogDto) {
    return this.blogService.findAll(listBlogDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Blog Details',
  })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  // @Put(':id')
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Blog',
  })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Blog',
  })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
