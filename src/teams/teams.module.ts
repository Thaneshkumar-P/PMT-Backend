import { forwardRef, Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './teams.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [TeamsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}

