import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicCertificateService } from './public-certificate.service';
import { ListCertificateDto } from 'src/modules/admin/certificates/dto/list-certificate.dto';

@ApiTags('Public Certificate')
@Controller('api/v1/public/certificate')
export class PublicCertificateController {
  private readonly logger = new Logger(PublicCertificateController.name);

  constructor(
    private readonly certificateService: PublicCertificateService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Certificate List',
  })
  async findAll(@Query() listCertificateDto: ListCertificateDto) {
    this.logger.log('Public Certificate List');

    return this.certificateService.findAll(listCertificateDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Certificate By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Certificate ${id}`);

    return this.certificateService.findOne(id);
  }
}