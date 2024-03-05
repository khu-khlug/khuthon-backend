import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { PasswordGenerator } from '@khlug/khuthon/core/password/PasswordGenerator';
import { ExaminerEntity } from '@khlug/khuthon/entities/ExaminerEntity';

@Injectable()
export class ExaminerManageService {
  constructor(
    @InjectRepository(ExaminerEntity)
    private readonly examinerRepository: Repository<ExaminerEntity>,

    private readonly passwordGenerator: PasswordGenerator,
  ) {}

  async createExaminer(name: string, code: string): Promise<ExaminerEntity> {
    const year = new Date().getFullYear();
    const password = this.passwordGenerator.generate(code);

    const newExaminer = this.examinerRepository.create({
      id: ulid(),
      year,
      name,
      codeHash: password.hash,
      codeSalt: password.salt,
    });
    await this.examinerRepository.save(newExaminer);

    return newExaminer;
  }

  async removeExaminer(examinerId: string): Promise<void> {
    await this.examinerRepository.delete({ id: examinerId });
  }
}
