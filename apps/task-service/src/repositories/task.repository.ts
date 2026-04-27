import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto } from '@app/common';
@Injectable()
export class TaskRepositoryService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async createTask(data: CreateTaskDto & { userId: string }) {
    return this.taskModel.create(data);
  }

  async getTasksByUser(userId: string, page = 1, limit = 10) {
    return this.taskModel
      .find({ userId })
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskModel.findOneAndUpdate(
      { _id: taskId, userId },
      updateTaskDto,
      { returnDocument: 'after' },
    );
  }
}
