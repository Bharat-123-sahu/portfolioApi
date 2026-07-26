import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ListContactDto } from './dto/list-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Contact',
  })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully.',
  })
  create(
    @Body()
    createContactDto: CreateContactDto,
  ) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Contact List',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'availableForHire',
    required: false,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
  })
  findAll(
    @Query()
    listContactDto: ListContactDto,
  ) {
    return this.contactService.findAll(listContactDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Contact Details',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.contactService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update Contact',
  })
  update(
    @Param('id')
    id: string,
    @Body()
    updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(
      id,
      updateContactDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete Contact',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.contactService.remove(id);
  }
}
