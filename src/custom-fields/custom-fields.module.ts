import { Module } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomField, CustomFieldSchema } from './custom-fields.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomField.name, schema: CustomFieldSchema }])],
  providers: [CustomFieldsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [CustomFieldsService],
  controllers: [CustomFieldsController]
})
export class CustomFieldsModule {}
