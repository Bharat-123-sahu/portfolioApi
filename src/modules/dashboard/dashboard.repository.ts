import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import { ProjectModel } from 'src/@database/project.model';
import { BlogModel } from 'src/@database/blog.model';
import { ExperienceModel } from 'src/@database/experience.model';
import { EducationModel } from 'src/@database/education.model';
import { SkillModel } from 'src/@database/skills.model';
import { CertificateModel } from 'src/@database/certificates.model';
import { ContactModel } from 'src/@database/contacts.model';

@Injectable()
export class DashboardRepositoryService {

  async getCounts() {
    const [
      skills,
      projects,
      blogs,
      experiences,
      education,
      certificates,
      contacts,
    ] = await Promise.all([
      SkillModel(mongoose.connection).countDocuments(),
      ProjectModel(mongoose.connection).countDocuments(),
      BlogModel(mongoose.connection).countDocuments(),
      ExperienceModel(mongoose.connection).countDocuments(),
      EducationModel(mongoose.connection).countDocuments(),
      CertificateModel(mongoose.connection).countDocuments(),
      ContactModel(mongoose.connection).countDocuments(),
    ]);

    return {
      skills,
      projects,
      blogs,
      experiences,
      education,
      certificates,
      contacts,
    };
  }

  async latestProjects() {
    return ProjectModel(mongoose.connection)
      .find()
      .sort({ createdAt: -1 })
      .limit(5);
  }

  async latestBlogs() {
    return BlogModel(mongoose.connection)
      .find()
      .sort({ createdAt: -1 })
      .limit(5);
  }
}