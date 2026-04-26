import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true, required: true })
  name!: string;

  @Prop({
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
    index: true,
  })
  email!: string;

  @Prop({ required: true })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
