import { Module } from '@nestjs/common';
import { PublicCertificateController } from './public-certificate.controller';
import { PublicCertificateService } from './public-certificate.service';

@Module({
  controllers: [PublicCertificateController],
  providers: [PublicCertificateService]
})
export class PublicCertificateModule {}
