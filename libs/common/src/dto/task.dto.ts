import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: 'pending' | 'completed';
}
