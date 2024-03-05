import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { UserRole } from '@khlug/khuthon/core/auth/User';

import { ManagerExaminerService } from '../services/ManagerExaminerService';
import { CreateExaminerRequestDto } from './dto/manager/CreateExaminerRequestDto';
import { CreateExaminerResponseDto } from './dto/manager/CreateExaminerResponseDto';

@Controller()
export class ManagerExaminerController {
  constructor(
    private readonly managerExaminerService: ManagerExaminerService,
  ) {}

  @Post('/manager/examiners')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async createExaminer(
    @Body() requestDto: CreateExaminerRequestDto,
  ): Promise<CreateExaminerResponseDto> {
    const { name, code } = requestDto;

    const examiner = await this.managerExaminerService.createExaminer(
      name,
      code,
    );

    return new CreateExaminerResponseDto(examiner);
  }

  @Delete('/manager/examiners/:examinerId')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async removeExaminer(@Param('examinerId') examinerId: string): Promise<void> {
    await this.managerExaminerService.removeExaminer(examinerId);
  }
}
