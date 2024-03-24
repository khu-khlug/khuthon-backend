import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { UserRole } from '@khlug/khuthon/core/auth/User';

import { NoticeService } from '../service/NoticeService';
import { CreateNoticeRequestDto } from './dto/manager/CreateNoticeRequestDto';
import { CreateNoticeResponseDto } from './dto/manager/CreateNoticeResponseDto';
import { UpdateNoticeRequestDto } from './dto/manager/UpdateNoticeRequestDto';
import { UpdateNoticeResponseDto } from './dto/manager/UpdateNoticeResponseDto';

@Controller()
export class ManagerNoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('/manager/notices')
  // @Roles([UserRole.MANAGER])
  @Transactional()
  async createNotice(
    @Body() dto: CreateNoticeRequestDto,
  ): Promise<CreateNoticeResponseDto> {
    const { title, content } = dto;

    const notice = await this.noticeService.createNotice(title, content);

    return new CreateNoticeResponseDto(notice);
  }

  @Put('/manager/notices/:noticeId')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async updateNotice(
    @Body() dto: UpdateNoticeRequestDto,
    @Param('noticeId') noticeId: string,
  ): Promise<UpdateNoticeResponseDto> {
    const { title, content } = dto;

    const notice = await this.noticeService.updateNotice(
      noticeId,
      title,
      content,
    );

    return new UpdateNoticeResponseDto(notice);
  }

  @Delete('/manager/notices/:noticeId')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async deleteNotice(@Param('noticeId') noticeId: string): Promise<void> {
    await this.noticeService.deleteNotice(noticeId);
  }
}
