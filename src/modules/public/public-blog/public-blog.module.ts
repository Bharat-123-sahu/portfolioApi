import { Module } from '@nestjs/common';
import { PublicBlogController } from './public-blog.controller';
import { PublicBlogService } from './public-blog.service';

@Module({
  controllers: [PublicBlogController],
  providers: [PublicBlogService]
})
export class PublicBlogModule {}
