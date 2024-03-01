import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '@khlug/constant/message';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';
import { KhuthonLogger } from '@khlug/khuthon/log/KhuthonLogger';
import { SmsSender } from '@khlug/khuthon/sms/SmsSender';

@Injectable()
export class TeamManageService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,

    private readonly logger: KhuthonLogger,
    private readonly smsSender: SmsSender,
  ) {}

  async updateTeamIdea(teamId: string, idea: string): Promise<void> {
    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    team.idea = idea;
    await this.teamRepository.save(team);

    await this.logger.log(
      `관리자가 ${team.name} 팀의 주제를 '${idea}'로 지정했습니다.`,
    );
  }

  async updateTeamPrize(teamId: string, prize: string): Promise<void> {
    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    team.prize = prize;
    await this.teamRepository.save(team);

    await this.logger.log(
      `관리자가 ${team.name} 팀에게 '${prize}'을 지정했습니다.`,
    );
  }

  async leaveTeam(teamId: string): Promise<void> {
    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const smsTargetPhoneNumbers = team.members
      .map((member) => member.phone)
      .filter((phone): phone is string => !!phone);

    for (const phone of smsTargetPhoneNumbers) {
      await this.smsSender.send(
        phone,
        `[khuthon] ${team.name} 팀의 참가 신청이 취소되었습니다.`,
      );
    }

    await this.teamRepository.delete(team.id);

    await this.logger.log(
      `관리자가 ${team.name} 팀의 참가 신청을 취소했습니다.`,
    );
  }
}