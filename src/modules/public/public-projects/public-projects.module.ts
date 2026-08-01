import { Module } from '@nestjs/common';
import { PublicProjectsController } from './public-projects.controller';
import { PublicProjectsService } from './public-projects.service';

@Module({
  controllers: [PublicProjectsController],
  providers: [PublicProjectsService]
})
export class PublicProjectsModule {}
