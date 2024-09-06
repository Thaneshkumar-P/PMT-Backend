import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersController } from './users.controller';
import { TeamsModule } from 'src/teams/teams.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => TeamsModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: (process.env.JWT as string),
      signOptions: { expiresIn: '24h' },
    }),  
  ],
  providers: [UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
