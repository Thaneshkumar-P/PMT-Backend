import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Post()
  CreateTeam(@Body() createTeamDto: Record<string, any>) {
    return this.teamService.createTeam(createTeamDto.teamName, createTeamDto.users)
  }

  @Get()
  GetTeams() {
    return this.teamService.getAllTeams()
  }

  @Get(':id')
  GetTeam(@Param() teamDto: Record<string, any>) {
    return this.teamService.getTeamUsers(teamDto.id)
  }

  @Put()
  UpdateTeam(@Body() teamDto: Record<string, any>) {
    return this.teamService.updateTeam(teamDto.teamName, teamDto.users, teamDto.id)
  }

  @Delete()
  DeleteTeam(@Body() teamDto: Record<string, any>) {
    return this.teamService.deleteTeam(teamDto.id)
  }
}
