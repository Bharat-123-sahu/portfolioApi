import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepositoryService } from './dashboard.repository';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepositoryService],
})
export class DashboardModule {}
