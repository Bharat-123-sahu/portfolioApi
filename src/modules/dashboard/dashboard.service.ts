import { Injectable } from '@nestjs/common';
import { DashboardRepositoryService } from './dashboard.repository';

@Injectable()
export class DashboardService {

  constructor(
    private readonly repository: DashboardRepositoryService,
  ) {}

  async getDashboard() {

    const [
      counts,
      latestProjects,
      latestBlogs,
    ] = await Promise.all([
      this.repository.getCounts(),
      this.repository.latestProjects(),
      this.repository.latestBlogs(),
    ]);

    return {

      stats: [
        {
          title: 'Projects',
          value: counts.projects,
          icon: 'folder-open-outline',
          color: 'primary',
        },
        {
          title: 'Blogs',
          value: counts.blogs,
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
      ],

      latestProjects,

      latestBlogs,

      storage: {
        title: 'Storage',
        value: 35,
        total: 100,
        icon: 'server-outline',
      },

      systemStatus: [
        {
          title: 'MongoDB',
          status: 'online',
        },
        {
          title: 'API',
          status: 'online',
        },
        {
          title: 'Uploads',
          status: 'online',
        },
      ],

      activities: [],

      quickActions: [
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
      ],
    };
  }
}