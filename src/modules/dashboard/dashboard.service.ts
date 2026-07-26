import { Injectable } from '@nestjs/common';
import { DashboardRepositoryService } from './dashboard.repository';

@Injectable()
export class DashboardService {

  constructor(
    private readonly repository: DashboardRepositoryService,
  ) {}

  async getDashboard() {
    const [
      stats,
      latestProjects,
      latestBlogs,
      activities,
      storage,
      systemStatus,
      quickActions,
    ] = await Promise.all([
      this.getStats(),
      this.getLatestProjects(),
      this.getLatestBlogs(),
      this.getRecentActivities(),
      this.getStorageInfo(),
      this.getSystemStatus(),
      this.getQuickActions(),
    ]);

    return {
      stats,
      latestProjects,
      latestBlogs,
      activities,
      storage,
      systemStatus,
      quickActions,
    };
  }

  async getStats() {
    const counts = await this.repository.getCounts();

    return [
      {
        title: 'Projects',
        value: counts.projects,
        meta: `${counts.activeProjects} active`,
        icon: 'folder-open-outline',
        color: 'primary',
      },
      {
        title: 'Blogs',
        value: counts.blogs,
        meta: `${counts.publishedBlogs} published`,
        icon: 'newspaper-outline',
        color: 'success',
      },
      {
        title: 'Skills',
        value: counts.skills,
        icon: 'code-slash-outline',
        color: 'warning',
      },
      {
        title: 'Certificates',
        value: counts.certificates,
        icon: 'ribbon-outline',
        color: 'secondary',
      },
      {
        title: 'Contacts',
        value: counts.contacts,
        icon: 'person-outline',
        color: 'tertiary',
      },
      {
        title: 'Experience',
        value: counts.experiences,
        icon: 'briefcase-outline',
        color: 'medium',
      },
      {
        title: 'Education',
        value: counts.education,
        icon: 'school-outline',
        color: 'dark',
      },
    ];
  }

  async getLatestProjects() {
    return this.repository.getLatestProjects();
  }

  async getLatestBlogs() {
    return this.repository.getLatestBlogs();
  }

  async getRecentActivities() {
    return this.repository.getRecentActivities();
  }

  async getStorageInfo() {
    return this.repository.getStorageInfo();
  }

  async getSystemStatus() {
    return this.repository.getSystemStatus();
  }

  getQuickActions() {
    return [
      {
        title: 'Add Project',
        route: '/dashboard/projects/create',
        icon: 'folder-open-outline',
      },
      {
        title: 'Write Blog',
        route: '/dashboard/blogs/create',
        icon: 'newspaper-outline',
      },
      {
        title: 'Add Skill',
        route: '/dashboard/skills/create',
        icon: 'code-slash-outline',
      },
      {
        title: 'Upload File',
        route: '/dashboard/upload',
        icon: 'cloud-upload-outline',
      },
    ];
  }
}
