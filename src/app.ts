import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'node:path';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(__dirname, 'profile/profile.graphql')],
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault({
        embed: { runTelemetry: false },
        document: `query Profile {
  profile {
    name
    description
    links { label url }
    skills { name }
    experience { company position startDate endDate achievements }
    projects { name description url stack }
  }
}`,
      })],
      includeStacktraceInErrorResponses: false,
      formatError: (error) => ({
        message: error.extensions?.code === 'INTERNAL_SERVER_ERROR'
          ? 'Internal server error' : error.message,
        extensions: { code: error.extensions?.code },
      }),
    }),
    ProfileModule,
  ],
})
class AppModule {}

export async function createApp() {
  return NestFactory.create(AppModule, { logger: ['error', 'warn'] });
}
