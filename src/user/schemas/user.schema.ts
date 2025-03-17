import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<user>;

@Schema({ timestamps: true })
export class user {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  avatar: string;

  @Prop()
  address: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  isVerify: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  code: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const userSchema = SchemaFactory.createForClass(user);
