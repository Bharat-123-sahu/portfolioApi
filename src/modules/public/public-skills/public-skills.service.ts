import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { SkillModel } from 'src/@database/skills.model';
import { ListSkillDto } from 'src/modules/admin/skills/dto/list-skills.dto';


@Injectable()
export class PublicSkillsService {
  private readonly logger = new Logger(PublicSkillsService.name);

  async findAll(listSkillDto: ListSkillDto) {
    const page = Number(listSkillDto.page) || 1;
    const perPage = Number(listSkillDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listSkillDto.search
      ? {
          title: {
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
        .sort({ createdAt: -1 })
        .lean(),

      SkillModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      skills,
    };
  }

  async findOne(id: string) {
    const skill = await SkillModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!skill) {
      throw new HttpException(
        'Skill not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      skill,
    };
  }
}