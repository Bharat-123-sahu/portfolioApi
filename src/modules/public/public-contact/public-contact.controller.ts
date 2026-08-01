import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicContactService } from './public-contact.service';
import { ListContactDto } from 'src/modules/admin/contact/dto/list-contact.dto';

@ApiTags('Public Contact')
@Controller('api/v1/public/contact')
export class PublicContactController {
  private readonly logger = new Logger(PublicContactController.name);

  constructor(
    private readonly contactService: PublicContactService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Contact List',
  })
  async findAll(@Query() listContactDto: ListContactDto) {
    this.logger.log('Public Contact List');

    return this.contactService.findAll(listContactDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Contact By Id',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Public Contact ${id}`);

    return this.contactService.findOne(id);
  }
}