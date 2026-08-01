import { Module } from '@nestjs/common';
import { PublicExperienceController } from './public-experience.controller';
import { PublicExperienceService } from './public-experience.service';

@Module({
  controllers: [PublicExperienceController],
  providers: [PublicExperienceService]
})
export class PublicExperienceModule {}
