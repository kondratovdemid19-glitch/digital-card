import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { HealthController } from '../health.controller';

@Module({
  providers: [PrismaService, ProfileService, ProfileResolver],
  controllers: [HealthController],
})
export class ProfileModule {}
