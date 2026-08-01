import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { SocialLinkModel } from 'src/@database/social-links.model';
import { ListSocialLinkDto } from 'src/modules/admin/social-links/dto/list-social-links.dto';


@Injectable()
export class PublicSocialLinksService {
  private readonly logger = new Logger(PublicSocialLinksService.name);

  async findAll(listSocialLinkDto: ListSocialLinkDto) {
    const page = Number(listSocialLinkDto.page) || 1;
    const perPage = Number(listSocialLinkDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listSocialLinkDto.search
      ? {
          platform: {
            $regex: listSocialLinkDto.search,
            $options: 'i',
          },
        }
      : {};

    const [socialLinks, total] = await Promise.all([
      SocialLinkModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      SocialLinkModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      socialLinks,
    };
  }

  async findOne(id: string) {
    const socialLink = await SocialLinkModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!socialLink) {
      throw new HttpException(
        'Social Link not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      socialLink,
    };
  }
}