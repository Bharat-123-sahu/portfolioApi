import { Module } from '@nestjs/common';
import { CertificateController } from './certificates.controller';
import { CertificateService } from './certificates.service';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificatesModule {}
