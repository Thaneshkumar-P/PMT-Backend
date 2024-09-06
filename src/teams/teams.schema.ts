import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ strict: false })
export class Team {
  @Prop({ required: true, unique: true })
  teamName: string;

  @Prop({ default: [] })
  users: ObjectId[]

  @Prop({ default: [] })
  projects: mongoose.Types.ObjectId[]
}

export const TeamSchema = SchemaFactory.createForClass(Team);
