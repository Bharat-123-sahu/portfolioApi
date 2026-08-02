import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/admin/auth/auth.module';
import { HeroModule } from './modules/admin/hero/hero.module';
import { AboutModule } from './modules/admin/about/about.module';
import { SkillsModule } from './modules/admin/skills/skills.module';
import { ExperienceModule } from './modules/admin/experience/experience.module';
import { EducationModule } from './modules/admin/education/education.module';
import { ProjectsModule } from './modules/admin/projects/projects.module';
import { ResumeModule } from './modules/admin/resume/resume.module';
import { UploadModule } from './modules/admin/upload/upload.module';
import { DashboardModule } from './modules/admin/dashboard/dashboard.module';
import { BlogsModule } from './modules/admin/blogs/blogs.module';
import { CertificatesModule } from './modules/admin/certificates/certificates.module';
import { ContactModule } from './modules/admin/contact/contact.module';
import { SocialLinksModule } from './modules/admin/social-links/social-links.module';
import { SettingsModule } from './modules/admin/settings/settings.module';
import { PublicHeroModule } from './modules/public/public-hero/public-hero.module';
import { PublicAboutModule } from './modules/public/public-about/public-about.module';
import { PublicSkillsModule } from './modules/public/public-skills/public-skills.module';
import { PublicExperienceModule } from './modules/public/public-experience/public-experience.module';
import { PublicEducationModule } from './modules/public/public-education/public-education.module';
import { PublicProjectsModule } from './modules/public/public-projects/public-projects.module';
import { PublicCertificateModule } from './modules/public/public-certificate/public-certificate.module';
import { PublicBlogModule } from './modules/public/public-blog/public-blog.module';
import { PublicContactModule } from './modules/public/public-contact/public-contact.module';
import { PublicResumeModule } from './modules/public/public-resume/public-resume.module';
import { PublicSocialLinksModule } from './modules/public/public-social-links/public-social-links.module';
import { PublicSettingsModule } from './modules/public/public-settings/public-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HeroModule,
    AboutModule,
    SkillsModule,
    ExperienceModule,
    EducationModule,
    ProjectsModule,
    ResumeModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    DashboardModule,
    BlogsModule,
    CertificatesModule,
    ContactModule,
    SocialLinksModule,
    SettingsModule,
    PublicHeroModule,
    PublicAboutModule,
    PublicSkillsModule,
    PublicExperienceModule,
    PublicEducationModule,
    PublicProjectsModule,
    PublicCertificateModule,
    PublicBlogModule,
    PublicContactModule,
    PublicResumeModule,
    PublicSocialLinksModule,
    PublicSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
