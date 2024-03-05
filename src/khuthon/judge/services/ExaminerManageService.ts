import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { ExaminerCodeGenerator } from '@khlug/khuthon/core/password/ExaminerCodeGenerator';
import { ExaminerEntity } from '@khlug/khuthon/entities/ExaminerEntity';

@Injectable()
export class ExaminerManageService {
  constructor(
    @InjectRepository(ExaminerEntity)
    private readonly examinerRepository: Repository<ExaminerEntity>,

    private readonly codeGenerator: ExaminerCodeGenerator,
  ) {}

  async createExaminer(name: string, code: string): Promise<ExaminerEntity> {
    const year = new Date().getFullYear();
    const codeHash = this.codeGenerator.generate(code);

    const newExaminer = this.examinerRepository.create({
      id: ulid(),
      year,
      name,
      codeHash,
    });
    await this.examinerRepository.save(newExaminer);

    return newExaminer;
  }

  async removeExaminer(examinerId: string): Promise<void> {
    await this.examinerRepository.delete({ id: examinerId });
  }
}
