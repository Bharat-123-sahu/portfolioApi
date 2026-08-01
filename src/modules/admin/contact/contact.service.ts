import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ListContactDto } from './dto/list-contact.dto';
import { ContactModel } from 'src/@database/contacts.model';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async create(createContactDto: CreateContactDto) {
    const contact = await ContactModel(mongoose.connection)
      .findOne({
        email: createContactDto.email,
      })
      .select('_id')
      .lean();

    if (contact) {
      throw new HttpException('Contact already exists.', HttpStatus.CONFLICT);
    }

    const contactData = await ContactModel(mongoose.connection).create(
      createContactDto,
    );

    return {
      success: true,
      message: 'Contact created successfully.',
      contact: contactData,
    };
  }

  async findAll(listContactDto: ListContactDto) {
    const page = Number(listContactDto.page) || 1;
    const perPage = Number(listContactDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter: any = {};

    if (listContactDto.search) {
      filter.$or = [
        {
          name: {
            $regex: listContactDto.search,
            $options: 'i',
          },
        },
        {
          designation: {
            $regex: listContactDto.search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: listContactDto.search,
            $options: 'i',
          },
        },
      ];
    }

    if (listContactDto.availableForHire !== undefined) {
      filter.availableForHire = listContactDto.availableForHire;
    }

    if (listContactDto.isActive !== undefined) {
      filter.isActive = listContactDto.isActive;
    }

    const [contacts, total] = await Promise.all([
      ContactModel(mongoose.connection)
        .find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      ContactModel(mongoose.connection).countDocuments(filter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      contacts,
    };
  }

  async findOne(id: string) {
    const contact = await ContactModel(mongoose.connection).findById(id).lean();

    if (!contact) {
      throw new HttpException('Contact not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      contact,
    };
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    if (updateContactDto.email) {
      const existing = await ContactModel(mongoose.connection)
        .findOne({
          email: updateContactDto.email,
          _id: { $ne: id },
        })
        .select('_id')
        .lean();

      if (existing) {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }

    const contact = await ContactModel(mongoose.connection)
      .findByIdAndUpdate(id, updateContactDto, {
        new: true,
      })
      .lean();

    if (!contact) {
      throw new HttpException('Contact not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Contact updated successfully.',
      contact,
    };
  }

  async remove(id: string) {
    const contact = await ContactModel(mongoose.connection)
      .findByIdAndDelete(id)
      .select('_id')
      .lean();

    if (!contact) {
      throw new HttpException('Contact not found.', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Contact deleted successfully.',
    };
  }
}
