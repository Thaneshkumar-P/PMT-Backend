import { Module } from '@nestjs/common';
import { PhasesController } from './phases.controller';
import { PhasesService } from './phases.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Phase, PhaseSchema } from './phases.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PhasesController],
  imports: [
    MongooseModule.forFeature([{ name: Phase.name, schema: PhaseSchema }]),
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: (process.env.JWT as string),
      signOptions: { expiresIn: '24h' },
    }),  
  ],
  providers: [PhasesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class PhasesModule {}
