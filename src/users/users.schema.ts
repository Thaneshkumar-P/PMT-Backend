import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ strict: false })
export class User {

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  fatherName: string

  @Prop()
  resetToken: string;

  @Prop({ required: true })
  phoneNo: number

  @Prop({ required: true })
  country: string

  @Prop({ required: true })
  state: string

  @Prop({ required: true })
  city: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  pincode: string

  @Prop({ required: true })
  access: 1 | 2 | 3

  @Prop({ required: true })
  role: string

  @Prop({ default: false })
  loggedIn: boolean

  @Prop({ default: false })
  locked: boolean

  @Prop({ default: [] })
  teams: ObjectId[]

  @Prop({ default: [] })
  projects: ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);
