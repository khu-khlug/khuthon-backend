import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ulid } from 'ulid';

import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { SmsSender } from '@khlug/khuthon/core/sms/SmsSender';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';
import { VoteEntity } from '@khlug/khuthon/entities/VoteEntity';
import { EventService } from '@khlug/khuthon/event/services/EventService';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly voteRepository: Repository<VoteEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,

    private readonly eventService: EventService,
    private readonly smsSender: SmsSender,
    private readonly logger: KhuthonLogger,
  ) {}

  async vote(sourceTeamId: string, destTeamIds: string[]): Promise<void> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isJudging()) {
      throw new UnprocessableEntityException(Message.CANNOT_VOTE_NOW);
    }

    const sourceTeam = await this.teamRepository.findOneBy({
      id: sourceTeamId,
    });
    if (!sourceTeam) {
      throw new UnprocessableEntityException(Message.TEAM_NOT_FOUND);
    }

    // 중복 투표 방지
    const prevVoteCount = await this.voteRepository.countBy({
      sourceTeamId: sourceTeamId,
    });
    if (prevVoteCount > 0) {
      throw new UnprocessableEntityException(Message.ALREADY_VOTED);
    }

    // 팀 중복 선택 방지
    const uniqueDestTeamIdSet = new Set(destTeamIds);
    if (uniqueDestTeamIdSet.size !== destTeamIds.length) {
      throw new UnprocessableEntityException(Message.INVALID_VOTE_DEST_TEAM);
    }

    const destTeams = await this.teamRepository.find({
      where: { id: In(destTeamIds) },
    });
    if (destTeams.length !== destTeamIds.length) {
      throw new UnprocessableEntityException(Message.TEAM_NOT_FOUND);
    }

    const votes = destTeamIds.map((destTeamId) =>
      this.voteRepository.create({
        id: ulid(),
        year: event.year,
        sourceTeamId,
        destTeamId,
      }),
    );

    const sourceTeamMembers = await this.memberRepository.findBy({
      teamId: sourceTeamId,
    });

    await this.voteRepository.save(votes);

    await Promise.all(
      sourceTeamMembers.map((member) =>
        this.smsSender.send(
          member.phone!,
          `[khuthon] ${sourceTeam.name} 팀의 투표가 완료되었습니다.`,
        ),
      ),
    );
    await this.logger.log(`${sourceTeam.name} 팀이 투표를 완료했습니다.`);
  }
}
