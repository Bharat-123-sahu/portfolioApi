import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ContactModel } from 'src/@database/contacts.model';

import { ListContactDto } from 'src/modules/admin/contact/dto/list-contact.dto';

@Injectable()
export class PublicContactService {
  private readonly logger = new Logger(PublicContactService.name);

  async findAll(listContactDto: ListContactDto) {
    const page = Number(listContactDto.page) || 1;
    const perPage = Number(listContactDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listContactDto.search
      ? {
          name: {
            $regex: listContactDto.search,
            $options: 'i',
          },
        }
      : {};

    const [contacts, total] = await Promise.all([
      ContactModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      ContactModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      contacts,
    };
  }

  async findOne(id: string) {
    const contact = await ContactModel(mongoose.connection)
      .findById(id)
      .lean();

    if (!contact) {
      throw new HttpException(
        'Contact not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      contact,
    };
  }
}