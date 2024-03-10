import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { Message } from '@khlug/constant/message';
import { S3Adapter } from '@khlug/khuthon/core/s3/S3Adapter';
import { FileEntity } from '@khlug/khuthon/entities/FileEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,

    private readonly s3Adapter: S3Adapter,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    memberId: string | null,
  ): Promise<FileEntity> {
    const ext = file.originalname.split('.').pop();
    const fileKey = `files/${ulid()}.${ext}`;

    await this.s3Adapter.uploadObject(fileKey, file.buffer);

    const teamId = memberId ? await this.getTeamIdByMemberId(memberId) : null;

    const newFile = this.fileRepository.create({
      id: ulid(),
      teamId,
      fileName: file.originalname,
      fileKey,
    });
    await this.fileRepository.save(newFile);

    return newFile;
  }

  private async getTeamIdByMemberId(memberId: string): Promise<string> {
    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new NotFoundException(Message.MEMBER_NOT_FOUND);
    }

    const teamId = member.teamId;
    if (!teamId) {
      throw new NotFoundException(Message.MEMBER_NO_TEAM);
    }

    return teamId;
  }
}
