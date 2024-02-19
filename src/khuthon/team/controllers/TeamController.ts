import { Body, Controller, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { RegisterTeamResponseDto } from './dto/RegisterTeamResponseDto';
import { RegisterTeamRequestDto } from './dto/RegisterTeamRequestDto';

@Controller()
export class TeamController {
  @Post('/teams')
  @Transactional()
  async registerTeam(
    @Body() requestDto: RegisterTeamRequestDto,
  ): Promise<RegisterTeamResponseDto> {
    const {} = requestDto;

    return {};
  }
}
