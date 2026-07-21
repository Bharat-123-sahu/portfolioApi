import { Module } from '@nestjs/common';
import { SocialLinkController } from './social-links.controller';
import { SocialLinkService } from './social-links.service';

@Module({
  controllers: [SocialLinkController],
  providers: [SocialLinkService],
})
export class SocialLinksModule {}
