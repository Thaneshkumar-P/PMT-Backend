import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhaseDocument = Phase & Document;

@Schema()
class Task {
  [x: string]: any;
  @Prop({ required: true })
  taskName: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  description: string;

  @Prop()
  createdBy: string;

  @Prop()
  assignedTo: string;

  @Prop()
  priority: string;

  @Prop()
  actualStartDate: Date;

  @Prop()
  actualEndDate: Date;

  @Prop()
  status: 'Drafted' | 'Completed' | 'In-Progress';

  @Prop({ default: 0 })
  completionPercentage: number;
}

const TaskSchema = SchemaFactory.createForClass(Task);

@Schema()
export class Phase {
  @Prop({ required: true })
  phaseName: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  description: string;

  @Prop()
  priority: string;

  @Prop()
  actualStartDate: Date;

  @Prop()
  actualEndDate: Date;

  @Prop()
  status: 'Drafted' | 'Completed' | 'In-Progress';

  @Prop()
  completed: number;

  @Prop({ default: 0 })
  completionPercentage: number;

  @Prop({ type: [TaskSchema], default: [] })
  tasks: Task[];
}

export const PhaseSchema = SchemaFactory.createForClass(Phase);
