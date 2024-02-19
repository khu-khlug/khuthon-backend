import { Controller, Post } from '@nestjs/common';

@Controller()
export class TeamController {
  @Post('/teams')
  async registerTeam() {}
}
