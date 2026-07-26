import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';

import { ProjectModel } from 'src/@database/project.model';
import { BlogModel } from 'src/@database/blog.model';
import { ExperienceModel } from 'src/@database/experience.model';
import { EducationModel } from 'src/@database/education.model';
import { SkillModel } from 'src/@database/skills.model';
import { CertificateModel } from 'src/@database/certificates.model';
import { ContactModel } from 'src/@database/contacts.model';

@Injectable()
export class DashboardRepositoryService {
  private readonly latestLimit = 5;
  private readonly uploadPath = join(process.cwd(), 'uploads');

  async getCounts() {
    const [
      skills,
      projects,
      blogs,
      experiences,
      education,
      certificates,
      contacts,
      activeProjects,
      publishedBlogs,
    ] = await Promise.all([
      SkillModel(mongoose.connection).countDocuments(),
      ProjectModel(mongoose.connection).countDocuments(),
      BlogModel(mongoose.connection).countDocuments(),
      ExperienceModel(mongoose.connection).countDocuments(),
      EducationModel(mongoose.connection).countDocuments(),
      CertificateModel(mongoose.connection).countDocuments(),
      ContactModel(mongoose.connection).countDocuments(),
      ProjectModel(mongoose.connection).countDocuments({ isActive: true }),
      BlogModel(mongoose.connection).countDocuments({
        isPublished: true,
        isActive: true,
      }),
    ]);

    return {
      skills,
      projects,
      blogs,
      experiences,
      education,
      certificates,
      contacts,
      activeProjects,
      publishedBlogs,
    };
  }

  async getLatestProjects() {
    return ProjectModel(mongoose.connection)
      .find()
      .sort({ createdAt: -1 })
      .limit(this.latestLimit)
      .lean();
  }

  async getLatestBlogs() {
    return BlogModel(mongoose.connection)
      .find()
      .sort({ createdAt: -1 })
      .limit(this.latestLimit)
      .lean();
  }

  async getRecentActivities() {
    const [
      projects,
      blogs,
      skills,
      certificates,
      contacts,
    ] = await Promise.all([
      ProjectModel(mongoose.connection)
        .find()
        .select('title createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(this.latestLimit)
        .lean(),
      BlogModel(mongoose.connection)
        .find()
        .select('title createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(this.latestLimit)
        .lean(),
      SkillModel(mongoose.connection)
        .find()
        .select('name createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(this.latestLimit)
        .lean(),
      CertificateModel(mongoose.connection)
        .find()
        .select('title createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(this.latestLimit)
        .lean(),
      ContactModel(mongoose.connection)
        .find()
        .select('name createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .limit(this.latestLimit)
        .lean(),
    ]);

    return [
      ...projects.map((item) => this.toActivity('Project', item.title, item)),
      ...blogs.map((item) => this.toActivity('Blog', item.title, item)),
      ...skills.map((item) => this.toActivity('Skill', item.name, item)),
      ...certificates.map((item) =>
        this.toActivity('Certificate', item.title, item),
      ),
      ...contacts.map((item) => this.toActivity('Contact', item.name, item)),
    ]
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime(),
      )
      .slice(0, this.latestLimit);
  }

  async getStorageInfo() {
    const usage = await this.getDirectoryUsage(this.uploadPath);
    const total = Number(process.env.STORAGE_LIMIT_MB || 100);
    const used = Number((usage.size / 1024 / 1024).toFixed(2));

    return {
      title: 'Storage',
      value: used,
      used,
      total,
      files: usage.files,
      unit: 'MB',
      percentage: total > 0 ? Number(((used / total) * 100).toFixed(2)) : 0,
      icon: 'server-outline',
    };
  }

  async getSystemStatus() {
    const uploadsOnline = await this.pathExists(this.uploadPath);

    return [
      {
        title: 'MongoDB',
        status: mongoose.connection.readyState === 1 ? 'online' : 'offline',
      },
      {
        title: 'API',
        status: 'online',
      },
      {
        title: 'Uploads',
        status: uploadsOnline ? 'online' : 'offline',
      },
    ];
  }

  async latestProjects() {
    return this.getLatestProjects();
  }

  async latestBlogs() {
    return this.getLatestBlogs();
  }

  private toActivity(type: string, title: string, item: any) {
    const date = item.updatedAt || item.createdAt || new Date();

    return {
      type,
      title,
      action:
        item.updatedAt && item.createdAt && item.updatedAt > item.createdAt
          ? 'updated'
          : 'created',
      date,
    };
  }

  private async pathExists(path: string) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async getDirectoryUsage(path: string): Promise<{
    size: number;
    files: number;
  }> {
    try {
      const entries = await fs.readdir(path, { withFileTypes: true });
      const usage = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = join(path, entry.name);

          if (entry.isDirectory()) {
            return this.getDirectoryUsage(entryPath);
          }

          if (!entry.isFile()) {
            return { size: 0, files: 0 };
          }

          const stats = await fs.stat(entryPath);

          return {
            size: stats.size,
            files: 1,
          };
        }),
      );

      return usage.reduce(
        (total, current) => ({
          size: total.size + current.size,
          files: total.files + current.files,
        }),
        { size: 0, files: 0 },
      );
    } catch {
      return { size: 0, files: 0 };
    }
  }
}
