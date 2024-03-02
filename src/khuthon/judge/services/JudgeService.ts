import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { ExaminerEntity } from '@khlug/khuthon/entities/ExaminerEntity';
import { JudgeEntity } from '@khlug/khuthon/entities/JudgeEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';
import { EventService } from '@khlug/khuthon/event/services/EventService';

@Injectable()
export class JudgeService {
  constructor(
    @InjectRepository(JudgeEntity)
    private readonly judgeRepository: Repository<JudgeEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(ExaminerEntity)
    private readonly examinerRepository: Repository<ExaminerEntity>,

    private readonly logger: KhuthonLogger,
    private readonly eventService: EventService,
  ) {}

  async judge(
    teamId: string,
    examinerId: string,
    points: {
      creativity: number;
      practicality: number;
      skill: number;
      design: number;
      completeness: number;
    },
  ): Promise<JudgeEntity> {
    const year = new Date().getFullYear();

    const event = await this.eventService.getThisYearEvent();
    if (!event.isJudging()) {
      throw new UnprocessableEntityException(Message.CANNOT_JUDGE_NOW);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new Error(Message.TEAM_NOT_FOUND);
    }

    const examiner = await this.examinerRepository.findOneBy({
      id: examinerId,
    });
    if (!examiner) {
      throw new Error(Message.EXAMINER_NOT_FOUND);
    }

    const prevJudge = await this.judgeRepository.findOneBy({
      teamId,
      examinerId,
      year,
    });

    if (prevJudge) {
      prevJudge.creativity = points.creativity;
      prevJudge.practicality = points.practicality;
      prevJudge.skill = points.skill;
      prevJudge.design = points.design;
      prevJudge.completeness = points.completeness;
      await this.judgeRepository.save(prevJudge);

      await this.logger.log(
        `${examiner.name}에서 ${team.name}의 점수를 다시 매겼습니다.`,
      );

      return prevJudge;
    } else {
      const newJudge = this.judgeRepository.create({
        id: ulid(),
        year,
        teamId,
        examinerId,
        creativity: points.creativity,
        practicality: points.practicality,
        skill: points.skill,
        design: points.design,
        completeness: points.completeness,
      });
      await this.judgeRepository.save(newJudge);

      await this.logger.log(
        `${examiner.name}에서 ${team.name}의 점수를 매겼습니다.`,
      );

      return newJudge;
    }
  }
}
