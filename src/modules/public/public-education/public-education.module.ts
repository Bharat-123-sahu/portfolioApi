import { Module } from '@nestjs/common';
import { PublicEducationController } from './public-education.controller';
import { PublicEducationService } from './public-education.service';

@Module({
  controllers: [PublicEducationController],
  providers: [PublicEducationService]
})
export class PublicEducationModule {}
