import { Module } from '@nestjs/common';
import { BlogController } from './blogs.controller';
import { BlogService } from './blogs.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogsModule {}
