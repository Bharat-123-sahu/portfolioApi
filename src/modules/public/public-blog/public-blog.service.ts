import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { BlogModel } from 'src/@database/blog.model';
import { ListBlogDto } from 'src/modules/admin/blogs/dto/list-blog.dto';

@Injectable()
export class PublicBlogService {
  private readonly logger = new Logger(PublicBlogService.name);

  async findAll(listBlogDto: ListBlogDto) {
    const page = Number(listBlogDto.page) || 1;
    const perPage = Number(listBlogDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listBlogDto.search
      ? {
          title: {
            $regex: listBlogDto.search,
            $options: 'i',
          },
        }
      : {};

    const [blogs, total] = await Promise.all([
      BlogModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      BlogModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      blogs,
    };
  }

  async findOne(id: string) {
    const blog = await BlogModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      blog,
    };
  }

  async findBySlug(slug: string) {
    const blog = await BlogModel(mongoose.connection)
      .findOne({
        slug: slug.toLowerCase(),
        isActive: { $ne: false },
        isPublished: { $ne: false },
      })
      .lean();

    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      blog,
    };
  }
}
