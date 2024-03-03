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

import { MemberState } from '@khlug/constant';
import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { S3Adapter } from '@khlug/khuthon/core/s3/S3Adapter';
import { SmsSender } from '@khlug/khuthon/core/sms/SmsSender';
import { FileEntity } from '@khlug/khuthon/entities/FileEntity';
import { InvitationEntity } from '@khlug/khuthon/entities/InvitationEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';
import { EventService } from '@khlug/khuthon/event/services/EventService';

type EditTeamParams = {
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
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,

    private readonly smsSender: SmsSender,
    private readonly logger: KhuthonLogger,
    private readonly s3Adapter: S3Adapter,
    private readonly eventService: EventService,
  ) {}

  async registerTeam(memberId: string, teamName: string): Promise<TeamEntity> {
    const year = new Date().getFullYear();

    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    // 최대 팀 수 초과 검사
    const teamCount = await this.teamRepository.countBy({ year });
    if (teamCount >= event.maxTeamCount) {
      throw new UnprocessableEntityException(
        Message.PARTICIPANT_LIMIT_EXCEEDED,
      );
    }

    // 최대 참가 인원 수 초과 검사
    const memberCount = await this.memberRepository.countBy({ year });
    if (memberCount >= event.maxMemberCount) {
      throw new UnprocessableEntityException(
        Message.PARTICIPANT_LIMIT_EXCEEDED,
      );
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.state !== MemberState.NEED_TEAM || member.teamId) {
      throw new UnprocessableEntityException(Message.CANNOT_REGISTER_TEAM_NOW);
    }

    const prevTeam = await this.teamRepository.findOneBy({
      year,
      name: teamName,
    });
    if (prevTeam) {
      throw new UnprocessableEntityException(Message.ALREADY_EXIST_TEAM_NAME);
    }

    const newTeamId = ulid();

    const newTeam = this.teamRepository.create({
      id: newTeamId,
      year,
      name: teamName,
      idea: '',
      note: '',
      prize: null,
    });
    await this.teamRepository.save(newTeam);

    member.teamId = newTeamId;
    member.state = MemberState.ACTIVE;
    await this.memberRepository.save(member);

    if (member.phone) {
      await this.smsSender.send(
        member.phone,
        `[khuthon] ${newTeam.name} 팀이 등록되었습니다.`,
      );
    }

    await this.logger.log(`${newTeam.name} 팀의 접수가 등록되었습니다.`);
    await this.logger.log(
      `${member.name}(${member.id}) 참가자의 대회 신청이 완료되었습니다.`,
    );

    return newTeam;
  }

  async deleteTeam(teamId: string, memberId: string): Promise<void> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const members = await this.memberRepository.findBy({ teamId });

    const member = members.find((member) => member.id === memberId);
    if (!member) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_WITHDRAW);
    }

    const smsTargetPhoneNumbers = members
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

  async editTeam(
    teamId: string,
    memberId: string,
    params: EditTeamParams,
  ): Promise<TeamEntity> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.teamId !== teamId) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_UPDATE_TEAM);
    }

    const { name, note } = params;

    if (name && name !== team.name) {
      await this.logger.log(`${team.name} 팀이 이름을 ${name}로 바꾸었습니다.`);
      team.name = name;
    }

    if (note && note !== team.note) {
      await this.logger.log(`${team.name} 팀이 비고 항목을 수정했습니다.`);
      team.note = note;
    }

    await this.teamRepository.save(team);

    return team;
  }

  async inviteTeamMember(
    teamId: string,
    memberId: string,
    studentNumber: string,
  ) {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new NotFoundException(Message.MEMBER_NOT_FOUND);
    }

    if (member.teamId !== teamId) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_UPDATE_TEAM);
    }

    const prevInvitation = await this.invitationRepository.findOneBy({
      year: event.year,
      studentNumber,
    });
    if (prevInvitation) {
      throw new UnprocessableEntityException(Message.ALREADY_EXIST_INVITATION);
    }

    const targetMember = await this.memberRepository.findOneBy({
      year: event.year,
      studentNumber,
    });
    if (targetMember && targetMember.state === MemberState.ACTIVE) {
      throw new UnprocessableEntityException(Message.ALREADY_EXIST_INVITATION);
    }

    const invitation = this.invitationRepository.create({
      id: ulid(),
      year: event.year,
      teamId,
      studentNumber,
      university: member.university,
    });
    await this.invitationRepository.save(invitation);

    await this.logger.log(
      `${team.name} 팀에서 ${member.name} 참가자가 ${studentNumber} 학번을 가진 참가자를 초대했습니다.`,
    );
  }

  async cancelInvitation(
    teamId: string,
    memberId: string,
    invitationId: string,
  ) {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new NotFoundException(Message.MEMBER_NOT_FOUND);
    }

    if (member.teamId !== teamId) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_UPDATE_TEAM);
    }

    const invitation = await this.invitationRepository.findOneBy({
      id: invitationId,
    });
    if (!invitation) {
      throw new NotFoundException(Message.INVITATION_NOT_FOUND);
    }

    if (invitation.teamId !== teamId) {
      throw new ForbiddenException(Message.FORBIDDEN_RESOURCE);
    }

    await this.invitationRepository.delete(invitation.id);

    await this.logger.log(
      `${team.name} 팀에서 ${member.name} 참가자가 초대를 취소했습니다.`,
    );
  }

  async joinTeam(memberId: string): Promise<TeamEntity> {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.state !== MemberState.NEED_TEAM || member.teamId) {
      throw new UnprocessableEntityException(Message.CANNOT_REGISTER_TEAM_NOW);
    }

    const invitation = await this.invitationRepository.findOneBy({
      year: event.year,
      studentNumber: member.studentNumber!,
    });
    if (!invitation) {
      throw new NotFoundException(Message.INVITATION_NOT_FOUND);
    }

    const team = await this.teamRepository.findOneBy({ id: invitation.teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    member.teamId = team.id;
    member.state = MemberState.ACTIVE;
    await this.memberRepository.save(member);
    await this.invitationRepository.delete({ id: invitation.id });

    if (member.phone) {
      await this.smsSender.send(
        member.phone,
        `[khuthon] ${team.name} 팀에 참가되었습니다.`,
      );
    }

    await this.logger.log(
      `${member.name}(${member.id}) 참가자가 ${team.name} 팀에 참가되었습니다.`,
    );

    return team;
  }

  async deleteTeamMember(
    teamId: string,
    memberId: string,
    targetMemberId: string,
  ) {
    const event = await this.eventService.getThisYearEvent();
    if (!event.isRegistering()) {
      throw new NotFoundException(Message.NO_REGISTERING_EVENT);
    }

    const team = await this.teamRepository.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(Message.TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new NotFoundException(Message.MEMBER_NOT_FOUND);
    }

    if (member.teamId !== teamId) {
      throw new ForbiddenException(Message.ONLY_MEMBERS_CAN_UPDATE_TEAM);
    }

    const targetMember = await this.memberRepository.findOneBy({
      id: targetMemberId,
    });
    if (!targetMember) {
      throw new NotFoundException(Message.MEMBER_NOT_FOUND);
    }

    if (targetMember.teamId !== teamId) {
      throw new ForbiddenException(Message.FORBIDDEN_RESOURCE);
    }

    targetMember.state = MemberState.NEED_TEAM;
    targetMember.teamId = null;
    await this.memberRepository.save(targetMember);

    await this.logger.log(
      `${team.name} 팀에서 ${member.name} 참가자가 ${targetMember.name} 참가자를 팀에서 내보냈습니다.`,
    );
  }

  async updateTeamIdea(
    teamId: string,
    memberId: string,
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

    const member = await this.memberRepository.findOneBy({
      teamId,
      id: memberId,
    });
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
