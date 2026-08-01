import { Module } from '@nestjs/common';
import { PublicHeroController } from './public-hero.controller';
import { PublicHeroService } from './public-hero.service';

@Module({
  controllers: [PublicHeroController],
  providers: [PublicHeroService]
})
export class PublicHeroModule {}
