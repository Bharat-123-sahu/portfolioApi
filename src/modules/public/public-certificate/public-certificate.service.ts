import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { CertificateModel } from 'src/@database/certificates.model';
import { ListCertificateDto } from 'src/modules/admin/certificates/dto/list-certificate.dto';


@Injectable()
export class PublicCertificateService {
  private readonly logger = new Logger(PublicCertificateService.name);

  async findAll(listCertificateDto: ListCertificateDto) {
    const page = Number(listCertificateDto.page) || 1;
    const perPage = Number(listCertificateDto.perPage) || 10;
    const skip = (page - 1) * perPage;

    const searchFilter = listCertificateDto.search
      ? {
          title: {
            $regex: listCertificateDto.search,
            $options: 'i',
          },
        }
      : {};

    const [certificates, total] = await Promise.all([
      CertificateModel(mongoose.connection)
        .find(searchFilter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .lean(),

      CertificateModel(mongoose.connection).countDocuments(searchFilter),
    ]);

    return {
      success: true,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      certificates,
    };
  }

  async findOne(id: string) {
    const certificate = await CertificateModel(mongoose.connection)
      .findById(id)
      .lean();

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
}