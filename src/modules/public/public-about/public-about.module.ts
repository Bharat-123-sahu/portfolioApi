import { Module } from '@nestjs/common';
import { PublicAboutController } from './public-about.controller';
import { PublicAboutService } from './public-about.service';

@Module({
  controllers: [PublicAboutController],
  providers: [PublicAboutService]
})
export class PublicAboutModule {}
