import { Body, Controller, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { TeamService } from '@khlug/khuthon/team/services/TeamService';

import { RegisterTeamRequestDto } from './dto/RegisterTeamRequestDto';
import { RegisterTeamResponseDto } from './dto/RegisterTeamResponseDto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/teams')
  @Transactional()
  async registerTeam(
    @Body() requestDto: RegisterTeamRequestDto,
  ): Promise<RegisterTeamResponseDto> {
    const {} = requestDto;

    return {};
  }
}
