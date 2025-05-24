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
  ): Promise<{ access_token: string | null, user: User | null, msg: string | null }> {
    const user = await this.usersService.login(email);
    if(!user) return {
      msg: 'No User found',
      user: null,
      access_token: null
    }
    if(!user.password) return {
      msg: 'User Password is not set',
      user: null,
      access_token: null
    }
    if (user?.password !== pass) {
      return {
        msg: 'Invalid Password',
        user: null,
        access_token: null
      }
    }
    if(user.locked) return {
      msg: 'Your access has been restricted',
      user: null,
      access_token: null
    }
    const payload = { username: user.fullName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
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
