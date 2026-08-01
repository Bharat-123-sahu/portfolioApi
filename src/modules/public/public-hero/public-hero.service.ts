import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { HeroModel } from 'src/@database/hero.model';
import { ListHeroDto } from 'src/modules/admin/hero/dto/list-hero.dto';

@Injectable()
export class PublicHeroService {
  private readonly logger = new Logger(PublicHeroService.name);

  async findAll(listHeroDto: ListHeroDto) {
    const page = Number(listHeroDto.page) || 1;
    const perPage = Number(listHeroDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listHeroDto.search
      ? {
          heading: {
            $regex: listHeroDto.search,
            $options: 'i',
          },
        }
      : {};

    const [heroes, total] = await Promise.all([
      HeroModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      HeroModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      heroes,
    };
  }

  async findOne(id: string) {
    const hero = await HeroModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!hero) {
      throw new HttpException('Hero not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      hero,
    };
  }
}