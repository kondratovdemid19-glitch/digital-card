import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.profile.findUnique({
      where: { slug: 'demid' },
      include: {
        links: { orderBy: { position: 'asc' } },
        skills: { orderBy: { position: 'asc' } },
        experience: { orderBy: { sortOrder: 'asc' } },
        projects: { orderBy: { position: 'asc' } },
      },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return {
      ...profile,
      experience: profile.experience.map((item) => ({
        ...item,
        startDate: item.startDate.toISOString().slice(0, 7),
        endDate: item.endDate?.toISOString().slice(0, 7) ?? null,
      })),
    };
  }
}
