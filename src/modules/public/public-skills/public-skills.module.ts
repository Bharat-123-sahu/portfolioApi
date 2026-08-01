import { Module } from '@nestjs/common';
import { PublicSkillsController } from './public-skills.controller';
import { PublicSkillsService } from './public-skills.service';

@Module({
  controllers: [PublicSkillsController],
  providers: [PublicSkillsService]
})
export class PublicSkillsModule {}
