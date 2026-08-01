import { Module } from '@nestjs/common';
import { PublicSocialLinksController } from './public-social-links.controller';
import { PublicSocialLinksService } from './public-social-links.service';

@Module({
  controllers: [PublicSocialLinksController],
  providers: [PublicSocialLinksService]
})
export class PublicSocialLinksModule {}
