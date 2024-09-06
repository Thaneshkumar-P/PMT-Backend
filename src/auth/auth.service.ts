import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string | null, msg: string | null }> {
    const user = await this.usersService.login(email);
    if(!user) return {
      msg: 'No User found',
      access_token: null
    }
    if(!user.password) return {
      msg: 'User Password is not set',
      access_token: null
    }
    if (user?.password !== pass) {
      return {
        msg: 'Invalid Password',
        access_token: null
      }
    }
    if(user.locked) return {
      msg: 'Your access has been restricted',
      access_token: null
    }
    const payload = { username: user.fullName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      msg: 'Success'
    };
  }

  async getUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  async setPassword(password: string, resetToken: string): Promise<User> {
    const user = await this.usersService.setPassword(password, resetToken)
    return user
  }

  async getResetToken(resetToken: string): Promise<{resetToken: string}> {
    return this.usersService.getResetToken(resetToken)
  }
}
