import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';


import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { SocialLinkModel } from 'src/@database/social-links.model';
import { ListSocialLinkDto } from './dto/list-social-links.dto';

@Injectable()
export class SocialLinkService {
  private readonly logger = new Logger(SocialLinkService.name);

  async create(createSocialLinkDto: CreateSocialLinkDto) {
    const socialLink = await SocialLinkModel(
      mongoose.connection,
    ).findOne({
      platform: createSocialLinkDto.platform,
    });

    if (socialLink) {
      throw new HttpException(
        'Social link already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const socialLinkData = await SocialLinkModel(
      mongoose.connection,
    ).create(createSocialLinkDto);

    return {
      success: true,
      message: 'Social link created successfully.',
      socialLink: socialLinkData,
    };
  }

  async findAll(listSocialLinkDto: ListSocialLinkDto) {
    const page = Number(listSocialLinkDto.page) || 1;
    const perPage = Number(listSocialLinkDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter: any = {};

    if (listSocialLinkDto.search) {
      filter.$or = [
        {
          platform: {
            $regex: listSocialLinkDto.search,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: listSocialLinkDto.search,
            $options: 'i',
          },
        },
      ];
    }

    if (listSocialLinkDto.isVisible !== undefined) {
      filter.isVisible = listSocialLinkDto.isVisible;
    }

    if (listSocialLinkDto.isActive !== undefined) {
      filter.isActive = listSocialLinkDto.isActive;
    }

    const [socialLinks, total] = await Promise.all([
      SocialLinkModel(mongoose.connection)
        .find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      SocialLinkModel(mongoose.connection).countDocuments(filter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      socialLinks,
    };
  }

  async findOne(id: string) {
    const socialLink = await SocialLinkModel(
      mongoose.connection,
    ).findById(id);

    if (!socialLink) {
      throw new HttpException(
        'Social link not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      socialLink,
    };
  }

  async update(
    id: string,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    if (updateSocialLinkDto.platform) {
      const existing = await SocialLinkModel(
        mongoose.connection,
      ).findOne({
        platform: updateSocialLinkDto.platform,
        _id: { $ne: id },
      });

      if (existing) {
        throw new HttpException(
          'Platform already exists.',
          HttpStatus.CONFLICT,
        );
      }
    }

    const socialLink = await SocialLinkModel(
      mongoose.connection,
    ).findByIdAndUpdate(id, updateSocialLinkDto, {
      new: true,
    });

    if (!socialLink) {
      throw new HttpException(
        'Social link not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Social link updated successfully.',
      socialLink,
    };
  }

  async remove(id: string) {
    const socialLink = await SocialLinkModel(
      mongoose.connection,
    ).findByIdAndDelete(id);

    if (!socialLink) {
      throw new HttpException(
        'Social link not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Social link deleted successfully.',
    };
  }
}