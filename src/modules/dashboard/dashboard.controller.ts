import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
// @ApiBearerAuth()
@Controller('api/v1/admin/dashboard')
export class DashboardController {

  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}