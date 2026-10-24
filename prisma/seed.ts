import { PrismaClient } from '@prisma/client';
import { profileData } from './profile-data';

export async function seedProfile(prisma: PrismaClient): Promise<void> {
  const { links, skills, experience, projects, ...profile } = profileData;
  await prisma.$transaction(async (tx) => {
    const record = await tx.profile.upsert({
      where: { slug: profile.slug }, create: profile, update: profile,
    });
    const profileId = record.id;
    await tx.link.deleteMany({ where: { profileId } });
    await tx.skill.deleteMany({ where: { profileId } });
    await tx.experience.deleteMany({ where: { profileId } });
    await tx.project.deleteMany({ where: { profileId } });
    await tx.link.createMany({ data: links.map((x) => ({ ...x, profileId })) });
    await tx.skill.createMany({ data: skills.map((x) => ({ ...x, profileId })) });
    await tx.experience.createMany({ data: experience.map((x) => ({ ...x, profileId })) });
    await tx.project.createMany({ data: projects.map((x) => ({ ...x, profileId })) });
  });
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedProfile(prisma)
    .catch(() => {
      console.error('Profile initialization failed');
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
