import { Body, Controller, Param, Post } from '@nestjs/common';

import { VoteService } from '../services/VoteService';
import { VoteRequestDto } from './dto/VoteRequestDto';

@Controller()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post('/teams/:teamId/vote')
  async vote(
    @Param('teamId') teamId: string,
    @Body() requestDto: VoteRequestDto,
  ) {
    // TODO[lery]: 인가 계층 구현 후 수정 필요
    const { destTeamIds } = requestDto;
    await this.voteService.vote(teamId, destTeamIds);
  }
}
