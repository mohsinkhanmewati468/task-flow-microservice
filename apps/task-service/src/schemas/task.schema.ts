import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  description!: string;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ default: 'pending' })
  status!: 'pending' | 'completed';
}

export const TaskSchema = SchemaFactory.createForClass(Task);

export type TaskDocument = HydratedDocument<Task>;
