import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectPreviewService } from './project-preview.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectPreviewService],
})
export class ProjectsModule {}
