import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomFieldDocument = CustomField & Document;

@Schema({ strict: false })
export class CustomField {
  @Prop({ required: true, unique: true })
  fieldName: string;

  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  fieldFor: string
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);
