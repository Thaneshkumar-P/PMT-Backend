import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ProjectDocument = Project & Document;

export type Settings =  {
  assigned: boolean
  mentioned: boolean
  isDue: boolean
  access: {
    user: string,
    type: number
    duration: string
  }[]
}

@Schema({ strict: false })
export class Project {
  
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  startDate: Date;

  @Prop({ required: true })
  endDate: Date

  @Prop()
  description: string;

  @Prop({ required: true })
  priority: string

  @Prop({})
  status: 'Completed' | 'Drafted' | 'On-Progress'

  @Prop({ type: 'string' })
  team: ObjectId

  @Prop({ default: 0 })
  completed: number

  @Prop({ default: 0 })
  approved: number

  @Prop({ type: Object })
  settings: Settings
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
