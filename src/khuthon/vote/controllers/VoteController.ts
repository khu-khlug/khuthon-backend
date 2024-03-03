import { Body, Controller, Param, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { MemberUser, UserRole } from '@khlug/khuthon/core/auth/User';

import { VoteService } from '../services/VoteService';
import { VoteRequestDto } from './dto/VoteRequestDto';

@Controller()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post('/teams/:teamId/vote')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async vote(
    @Requester() requester: MemberUser,
    @Param('teamId') teamId: string,
    @Body() requestDto: VoteRequestDto,
  ) {
    const { memberId } = requester;
    const { destTeamIds } = requestDto;

    await this.voteService.vote(teamId, memberId, destTeamIds);
  }
}
