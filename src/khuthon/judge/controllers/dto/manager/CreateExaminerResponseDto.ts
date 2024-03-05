import { ExaminerEntity } from '@khlug/khuthon/entities/ExaminerEntity';

export class CreateExaminerResponseDto {
  id: string;
  name: string;
  createdAt: Date;

  constructor(examiner: ExaminerEntity) {
    this.id = examiner.id;
    this.name = examiner.name;
    this.createdAt = examiner.createdAt;
  }
}
