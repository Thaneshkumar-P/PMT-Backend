import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './teams.schema';
import { Model, ObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
  ) {}


  async createTeam(
    teamName: string,
    users: ObjectId[]
  ) {
    await new this.teamModel({
      teamName,
      users
    }).save()

    const team = await this.teamModel.findOne({teamName})

    await this.usersService.findAndUpdateTeams(users, team.id)

    return team
  }

  async updateTeam(
    teamName: string,
    users: ObjectId[],
    id: string
  ){
    const oldTeam = await this.teamModel.findOneAndUpdate({ _id: id }, { teamName, users })
    const team = await this.teamModel.findOne({ _id: id })

    const removed = oldTeam.users.filter( user => !team.users.includes(user))

    console.log(removed)

    await this.usersService.findAndUpdateTeams(users, team.id, removed)

    return team
  }


  async getTeams(_id: ObjectId[]): Promise<Team[]> {
    const team = await this.teamModel.find({_id: _id}).exec()
    return team
  }


  async getTeamUsers(_id: string) {
    const team = await this.teamModel.findOne({ _id }).exec()

    const users = await this.usersService.findSome(team.users)

    return {
      team: team,
      users: users
    }
  }

  async removeDeletedUser(id: ObjectId, teamIds: ObjectId[]) {
    const teams = await this.teamModel.find({ _id: teamIds }).exec()

    await Promise.all(teams.map(async (team) => {
      const index = team.users.indexOf(id)
      team.users.splice(index, 1);
      await team.save();
    }));

    return;
  }

  async deleteTeam(id: ObjectId) {
    const team = await this.teamModel.findOneAndDelete({ _id: id }).exec()

    await this.usersService.deleteTeam(team.users, id)

    return team
  }

  async getAllTeams() {
    const teams = await this.teamModel.find({}).exec()
    return teams
  }
}
