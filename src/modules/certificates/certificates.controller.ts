import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ListCertificateDto } from './dto/list-certificate.dto';
import { CertificateService } from './certificates.service';

@ApiTags('Certificate')
@ApiBearerAuth()
@Controller('certificate')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Certificate' })
  @ApiResponse({
    status: 201,
    description: 'Certificate created successfully.',
  })
  create(@Body() dto: CreateCertificateDto) {
    return this.certificateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Certificate List' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  findAll(@Query() dto: ListCertificateDto) {
    return this.certificateService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Certificate Details' })
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Certificate' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCertificateDto,
  ) {
    return this.certificateService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Certificate' })
  remove(@Param('id') id: string) {
    return this.certificateService.remove(id);
  }
}