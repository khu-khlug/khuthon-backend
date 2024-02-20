import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { MemberState, TeamState } from '@khlug/constant';
import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/core/log/KhuthonLogger';
import { SmsSender } from '@khlug/core/sms/SmsSender';
import { EventEntity } from '@khlug/khuthon/entities/EventEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';

type RegisterTeamParams = {
  team: {
    name: string;
    note: string;
  };
  member: {
    studentNumber: number;
    name: string;
    university: string;
    college: string;
    grade: number;
    phone: string;
    email: string;
  };
};

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,

    private readonly smsSender: SmsSender,
    private readonly logger: KhuthonLogger,
  ) {}

  async registerTeam(params: RegisterTeamParams): Promise<TeamEntity> {
    const year = new Date().getFullYear();

    const event = await this.eventRepository.findOneBy({ year });
    if (!event || !event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const teamCount = await this.teamRepository.countBy({ year });
    if (teamCount >= event.maxTeamCount) {
      throw new NotFoundException(Message.PARTICIPANT_LIMIT_EXCEEDED);
    }

    const memberCount = await this.memberRepository.countBy({ year });
    if (memberCount >= event.maxMemberCount) {
      throw new NotFoundException(Message.PARTICIPANT_LIMIT_EXCEEDED);
    }

    const prevMember = await this.memberRepository.findOneBy({
      year,
      studentNumber: params.member.studentNumber,
    });
    if (prevMember) {
      throw new NotFoundException(Message.ALREADY_REGISTERED_MEMBER);
    }

    const prevTeam = await this.teamRepository.findOneBy({
      year,
      name: params.team.name,
    });
    if (prevTeam) {
      throw new NotFoundException(Message.ALREADY_EXIST_TEAM_NAME);
    }

    const newTeam = this.teamRepository.create({
      id: ulid(),
      year,
      name: params.team.name,
      idea: '',
      note: params.team.note,
      state: TeamState.REGISTERED,
    });
    await this.teamRepository.save(newTeam);

    const newMember = this.memberRepository.create({
      id: ulid(),
      year,
      teamId: newTeam.id,
      studentNumber: params.member.studentNumber,
      name: params.member.name,
      university: params.member.university,
      college: params.member.college,
      grade: params.member.grade,
      phone: params.member.phone,
      email: params.member.email,
      state: MemberState.VEILED,
    });
    await this.memberRepository.save(newMember);

    // TODO[lery]: 이메일 인증 구현 필요
    //             아래 메시지는 이메일 인증 이후에 보내는 걸로 처리해야 할 듯
    await this.smsSender.send(
      newMember.phone,
      `[khuthon] ${newTeam.name} 팀이 등록되었습니다. ${newMember.name} 참가자의 정보를 확인했습니다.`,
    );

    await this.logger.log(`${newTeam.name} 팀의 접수가 등록되었습니다.`);
    await this.logger.log(`${newMember.name} 참가자의 정보를 확인했습니다.`);

    return newTeam;
  }
}
