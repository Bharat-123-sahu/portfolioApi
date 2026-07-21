import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';

import { BlogModel } from 'src/@database/blog.model';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ListBlogDto } from './dto/list-blog.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  async create(createBlogDto: CreateBlogDto) {
    const blog = await BlogModel(mongoose.connection).findOne({
      slug: createBlogDto.slug,
    });

    if (blog) {
      throw new HttpException(
        'Blog with this slug already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const blogData = await BlogModel(mongoose.connection).create(
      createBlogDto,
    );

    return {
      success: true,
      message: 'Blog created successfully.',
      blog: blogData,
    };
  }

  async findAll(listBlogDto: ListBlogDto) {
    const page = Number(listBlogDto.page) || 1;
    const perPage = Number(listBlogDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter: any = {};

    if (listBlogDto.search) {
      filter.$or = [
        {
          title: {
            $regex: listBlogDto.search,
            $options: 'i',
          },
        },
        {
          category: {
            $regex: listBlogDto.search,
            $options: 'i',
          },
        },
        {
          tags: {
            $regex: listBlogDto.search,
            $options: 'i',
          },
        },
      ];
    }

    if (listBlogDto.category) {
      filter.category = listBlogDto.category;
    }

    if (listBlogDto.isPublished !== undefined) {
      filter.isPublished = listBlogDto.isPublished;
    }

    if (listBlogDto.isFeatured !== undefined) {
      filter.isFeatured = listBlogDto.isFeatured;
    }

    if (listBlogDto.isActive !== undefined) {
      filter.isActive = listBlogDto.isActive;
    }

    const [blogs, total] = await Promise.all([
      BlogModel(mongoose.connection)
        .find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      BlogModel(mongoose.connection).countDocuments(filter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      blogs,
    };
  }

  async findOne(id: string) {
    const blog = await BlogModel(mongoose.connection).findById(id);

    if (!blog) {
      throw new HttpException(
        'Blog not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      blog,
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    if (updateBlogDto.slug) {
      const existingBlog = await BlogModel(mongoose.connection).findOne({
        slug: updateBlogDto.slug,
        _id: {
          $ne: id,
        },
      });

      if (existingBlog) {
        throw new HttpException(
          'Blog slug already exists.',
          HttpStatus.CONFLICT,
        );
      }
    }

    const blog = await BlogModel(mongoose.connection).findByIdAndUpdate(
      id,
      updateBlogDto,
      {
        new: true,
      },
    );

    if (!blog) {
      throw new HttpException(
        'Blog not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Blog updated successfully.',
      blog,
    };
  }

  async remove(id: string) {
    const blog = await BlogModel(mongoose.connection).findByIdAndDelete(id);

    if (!blog) {
      throw new HttpException(
        'Blog not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Blog deleted successfully.',
    };
  }
}