import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { HeroModel } from 'src/@database/hero.model';
import mongoose from 'mongoose';
import { ListHeroDto } from './dto/list-hero.dto';

@Injectable()
export class HeroService {
  async create(createHeroDto: CreateHeroDto) {
    const hero = await HeroModel(mongoose.connection).findOne({
      title: createHeroDto.title, // unique field
    });

    if (hero) {
      throw new HttpException('Hero already exists.', HttpStatus.CONFLICT);
    }

    const heroData = await HeroModel(mongoose.connection).create(createHeroDto);

    return {
      success: true,
      message: 'Hero created successfully.',
      hero: heroData,
    };
  }

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

    const [heros, total] = await Promise.all([
      HeroModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 }),

      HeroModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      heros,
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} hero`;
  }

  async update(id: string, updateHeroDto: UpdateHeroDto) {
    const hero = await HeroModel(mongoose.connection).findById(id);

    if (!hero) {
      throw new HttpException('Hero not found.', HttpStatus.NOT_FOUND);
    }

    Object.assign(hero, updateHeroDto);

    await hero.save();

    return {
      success: true,
      message: 'Hero updated successfully.',
      hero: hero,
    };
  }

  async remove(id: string) {
    const hero = await HeroModel(mongoose.connection).findById(id);

    if (!hero) {
      throw new HttpException('Hero not found.', HttpStatus.NOT_FOUND);
    }

    await hero.deleteOne();

    return {
      success: true,
      message: 'Hero deleted successfully.',
    };
  }
}
