import { Module } from '@nestjs/common';
import { PublicContactController } from './public-contact.controller';
import { PublicContactService } from './public-contact.service';

@Module({
  controllers: [PublicContactController],
  providers: [PublicContactService]
})
export class PublicContactModule {}
