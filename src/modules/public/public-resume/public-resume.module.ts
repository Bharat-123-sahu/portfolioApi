import { Module } from '@nestjs/common';
import { PublicResumeController } from './public-resume.controller';
import { PublicResumeService } from './public-resume.service';

@Module({
  controllers: [PublicResumeController],
  providers: [PublicResumeService]
})
export class PublicResumeModule {}
