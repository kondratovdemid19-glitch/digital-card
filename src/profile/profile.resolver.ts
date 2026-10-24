import { Query, Resolver } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ProfileService } from './profile.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query('profile')
  async profile() {
    try {
      return await this.profiles.getProfile();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } });
      }
      throw error;
    }
  }
}
