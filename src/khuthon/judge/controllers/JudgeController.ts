import { Body, Controller, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { ExaminerUser, UserRole } from '@khlug/khuthon/core/auth/User';

import { JudgeService } from '../services/JudgeService';
import { JudgeRequestDto } from './dto/examiner/JudgeRequestDto';
import { JudgeResponseDto } from './dto/examiner/JudgeResponseDto';

@Controller()
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  @Post('/judge')
  @Roles([UserRole.EXAMINER])
  @Transactional()
  async judge(
    @Requester() requester: ExaminerUser,
    @Body() requestDto: JudgeRequestDto,
  ): Promise<JudgeResponseDto> {
    const { examinerId } = requester;
    const { teamId, points } = requestDto;

    const judge = await this.judgeService.judge(teamId, examinerId, points);

    return new JudgeResponseDto(judge);
  }
}
