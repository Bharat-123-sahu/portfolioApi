import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillModel } from 'src/@database/skills.model';
import { ListSkillDto } from './dto/list-skills.dto';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  async create(createSkillDto: CreateSkillDto) {
    const exists = await SkillModel(mongoose.connection).findOne({
      slug: createSkillDto.slug,
    });

    if (exists) {
      throw new HttpException('Skill already exists.', HttpStatus.CONFLICT);
    }

    const skill = await SkillModel(mongoose.connection).create(createSkillDto);

    return {
      success: true,
      message: 'Skill created successfully.',
      skill: skill,
    };
  }

  async findAll(listSkillDto: ListSkillDto) {
    const page = Number(listSkillDto.page) || 1;
    const perPage = Number(listSkillDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listSkillDto.search
      ? {
          name: {
            $regex: listSkillDto.search,
            $options: 'i',
          },
        }
      : {};

    const [skills, total] = await Promise.all([
      SkillModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        }),

      SkillModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      skills,
    };
  }

  async findOne(id: string) {
    const skill = await SkillModel(mongoose.connection).findById(id);

    if (!skill) {
      throw new HttpException('Skill not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      skill: skill,
    };
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await SkillModel(mongoose.connection).findByIdAndUpdate(
      id,
      updateSkillDto,
      {
        new: true,
      },
    );

    if (!skill) {
      throw new HttpException('Skill not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Skill updated successfully.',
      skill: skill,
    };
  }

  async remove(id: string) {
    const skill = await SkillModel(mongoose.connection).findByIdAndDelete(id);

    if (!skill) {
      throw new HttpException('Skill not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Skill deleted successfully.',
    };
  }
}
