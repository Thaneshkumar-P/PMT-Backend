import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './teams/teams.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { HttpModule } from '@nestjs/axios';
import { SeaweedfsService } from './seaweedfs.service';



@Module({
  imports: [AuthModule, UsersModule, HttpModule, ConfigModule.forRoot({ isGlobal: true }),     
    MongooseModule.forRoot(process.env.mongodb, { dbName: 'auth' }), TeamsModule, CustomFieldsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeaweedfsService],
  exports: [SeaweedfsService]
})
export class AppModule {}
