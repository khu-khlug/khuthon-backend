import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { MemberState, TeamState, University } from '@khlug/constant';
import { Message } from '@khlug/constant/message';
import { FileEntity } from '@khlug/khuthon/entities/FileEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';
import { EventService } from '@khlug/khuthon/event/services/EventService';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { S3Adapter } from '@khlug/khuthon/core/s3/S3Adapter';
import { SmsSender } from '@khlug/khuthon/core/sms/SmsSender';
import { isSameStringArray } from '@khlug/util';

type RegisterTeamParams = {
  team: {
    name: string;
    note: string;
  };
  member: {
    studentNumber: string;
    name: string;
    university: University;
    college: string;
    grade: number;
    phone: string;
    email: string;
  };
};

type EditTeamParams = {
  numbers: string[] | null;
  name: string | null;
  note: string | null;
};

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,

    private readonly smsSender: SmsSender,
    private readonly logger: KhuthonLogger,
    private readonly s3Adapter: S3Adapter,
    private readonly eventService: EventService,
  ) {}

  async registerTeam(params: RegisterTeamParams): Promise<TeamEntity> {
    const year = new Date().getFullYear();

    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const teamCount = await this.teamRepository.countBy({ year });
    if (teamCount >= event.maxTeamCount) {
      throw new UnprocessableEntityException(
        Message.PARTICIPANT_LIMIT_EXCEEDED,
      );
    }

    const memberCount = await this.memberRepository.countBy({ year });
    if (memberCount >= event.maxMemberCount) {
      throw new UnprocessableEntityException(
        Message.PARTICIPANT_LIMIT_EXCEEDED,
      );
    }

    const prevMember = await this.memberRepository.findOneBy({
      year,
      studentNumber: params.member.studentNumber,
    });
    if (prevMember) {
      throw new UnprocessableEntityException(Message.ALREADY_REGISTERED_MEMBER);
    }

    const prevTeam = await this.teamRepository.findOneBy({
      year,
      name: params.team.name,
    });
    if (prevTeam) {
      throw new UnprocessableEntityException(Message.ALREADY_EXIST_TEAM_NAME);
    }

    const newTeamId = ulid();

    const newMember = this.memberRepository.create({
      id: ulid(),
      year,
      teamId: newTeamId,
      studentNumber: params.member.studentNumber,
      name: params.member.name,
      university: params.member.university,
      college: params.member.college,
      grade: params.member.grade,
      phone: params.member.phone,
      email: params.member.email.toLowerCase(),
      state: MemberState.NEED_EMAIL_VERIFICATION,
    });

    const newTeam = this.teamRepository.create({
      id: newTeamId,
      year,
      name: params.team.name,
      idea: '',
      note: params.team.note,
      state: TeamState.REGISTERED,
      prize: null,
      members: [newMember],
    });

    await this.teamRepository.save(newTeam);

    // TODO[lery]: 이메일 인증 구현 필요
    //             아래 메시지는 이메일 인증 이후에 보내는 걸로 처리해야 할 듯
    await this.smsSender.send(
      params.member.phone,
      `[khuthon] ${newTeam.name} 팀이 등록되었습니다. ${newMember.name} 참가자의 정보를 확인했습니다.`,
    );

    await this.logger.log(`${newTeam.name} 팀의 접수가 등록되었습니다.`);
    await this.logger.log(`${newMember.name} 참가자의 정보를 확인했습니다.`);

    return newTeam;
  }

  async editTeam(teamId: string, params: EditTeamParams): Promise<TeamEntity> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const { name, note, numbers } = params;

    if (name && name !== team.name) {
      await this.logger.log(`${team.name} 팀이 이름을 ${name}로 바꾸었습니다.`);
      team.name = name;
    }

    if (note && note !== team.note) {
      await this.logger.log(`${team.name} 팀이 비고 항목을 수정했습니다.`);
      team.note = note;
    }

    if (numbers) {
      const prevStudentNumbers = team.members.map(
        (member) => member.studentNumber,
      );

      const newMembers = numbers
        .filter((studentNumber) => !prevStudentNumbers.includes(studentNumber))
        .map((studentNumber) =>
          this.memberRepository.create({
            id: ulid(),
            year: new Date().getFullYear(),
            teamId: team.id,
            studentNumber,
            state: MemberState.INVITING,
          }),
        );

      team.members = team.members
        .filter((member) => !numbers.includes(member.studentNumber))
        .concat(newMembers);

      const newStudentNumbers = team.members.map(
        (member) => member.studentNumber,
      );

      if (newStudentNumbers.length < 1 || newStudentNumbers.length > 4) {
        throw new UnprocessableEntityException(Message.INVALID_MEMBER_COUNT);
      }

      if (!isSameStringArray(prevStudentNumbers, newStudentNumbers)) {
        await this.logger.log(`${team.name} 팀이 팀원을 수정했습니다.`);
      }
    }

    await this.teamRepository.save(team);

    return team;
  }

  async leaveTeam(teamId: string, memberId: string): Promise<void> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = team.members.find((member) => member.id === memberId);
    if (!member) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_WITHDRAW);
    }

    const smsTargetPhoneNumbers = team.members
      .map((member) => member.phone)
      .filter((phone): phone is string => !!phone);

    for (const phone of smsTargetPhoneNumbers) {
      await this.smsSender.send(
        phone,
        `[khuthon] ${team.name} 팀의 참가 신청이 철회되었습니다.`,
      );
    }

    await this.teamRepository.delete(team.id);

    await this.logger.log(`${team.name} 팀의 참가 신청이 철회되었습니다.`);
  }

  async updateTeamIdea(
    memberId: string,
    teamId: string,
    idea: string,
  ): Promise<void> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isOngoing()) {
      throw new NotFoundException(Message.CANNOT_EDIT_NOW);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = team.members.find((member) => member.id === memberId);
    if (!member) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_UPDATE_TEAM_IDEA);
    }

    team.idea = idea;
    await this.teamRepository.save(team);

    await this.logger.log(
      `${team.name} 팀에서 주제를 ${team.idea}로 지정했습니다.`,
    );
  }

  async issueAttachmentUploadUrl(
    teamId: string,
  ): Promise<{ fileId: string } & PresignedPost> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isOngoing()) {
      throw new UnprocessableEntityException(
        Message.CANNOT_SUBMIT_ATTACHMENT_NOW,
      );
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const fileKey = `attachments/${team.id}/${ulid()}.pdf`;
    const presignedPost = await this.s3Adapter.getPresignedPost(fileKey);

    const newFile = this.fileRepository.create({
      id: ulid(),
      teamId,
      fileKey,
    });
    await this.fileRepository.save(newFile);

    await this.logger.log(`${team.name} 팀에서 자료를 제출했습니다.`);

    return { fileId: newFile.id, ...presignedPost };
  }

  async deleteAttachment(teamId: string, fileId: string): Promise<void> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isOngoing()) {
      throw new UnprocessableEntityException(
        Message.CANNOT_SUBMIT_ATTACHMENT_NOW,
      );
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const file = await this.fileRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException(Message.FILE_NOT_FOUND);
    }

    if (file.teamId !== team.id) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_DELETE_ATTACHMENT);
    }

    await this.s3Adapter.deleteObject(file.fileKey);
    await this.fileRepository.delete(file.id);

    await this.logger.log(`${team.name} 팀에서 자료를 삭제했습니다.`);
  }
}
