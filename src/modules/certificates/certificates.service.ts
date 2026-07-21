import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';


import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ListCertificateDto } from './dto/list-certificate.dto';
import { CertificateModel } from 'src/@database/certificates.model';

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  async create(createCertificateDto: CreateCertificateDto) {
    const certificate = await CertificateModel(
      mongoose.connection,
    ).findOne({
      title: createCertificateDto.title,
      issuer: createCertificateDto.issuer,
    });

    if (certificate) {
      throw new HttpException(
        'Certificate already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const certificateData = await CertificateModel(
      mongoose.connection,
    ).create(createCertificateDto);

    return {
      success: true,
      message: 'Certificate created successfully.',
      certificate: certificateData,
    };
  }

  async findAll(listCertificateDto: ListCertificateDto) {
    const page = Number(listCertificateDto.page) || 1;
    const perPage = Number(listCertificateDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const filter: any = {};

    if (listCertificateDto.search) {
      filter.$or = [
        {
          title: {
            $regex: listCertificateDto.search,
            $options: 'i',
          },
        },
        {
          issuer: {
            $regex: listCertificateDto.search,
            $options: 'i',
          },
        },
      ];
    }

    if (listCertificateDto.isActive !== undefined) {
      filter.isActive = listCertificateDto.isActive;
    }

    const [certificates, total] = await Promise.all([
      CertificateModel(mongoose.connection)
        .find(filter)
        .sort({
          displayOrder: 1,
          issueDate: -1,
        })
        .skip(skip)
        .limit(perPage),

      CertificateModel(mongoose.connection).countDocuments(filter),
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      certificates,
    };
  }

  async findOne(id: string) {
    const certificate = await CertificateModel(
      mongoose.connection,
    ).findById(id);

    if (!certificate) {
      throw new HttpException(
        'Certificate not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      certificate,
    };
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const certificate = await CertificateModel(
      mongoose.connection,
    ).findByIdAndUpdate(id, updateCertificateDto, {
      new: true,
    });

    if (!certificate) {
      throw new HttpException(
        'Certificate not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Certificate updated successfully.',
      certificate,
    };
  }

  async remove(id: string) {
    const certificate = await CertificateModel(
      mongoose.connection,
    ).findByIdAndDelete(id);

    if (!certificate) {
      throw new HttpException(
        'Certificate not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: 'Certificate deleted successfully.',
    };
  }
}