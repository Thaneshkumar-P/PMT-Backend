import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './projects.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: (process.env.JWT as string),
      signOptions: { expiresIn: '24h' },
    }),  
    TeamsModule
  ],
  providers: [ProjectsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
