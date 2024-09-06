import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  GetUsers() {
    return this.usersService.findAll()
  }

  @Get(':id') 
  GetUser(@Param() UsersDto: Record<string, any>){
    return this.usersService.findOne(UsersDto.id)
  }

  @Put('reset/:id')
  Reset(@Param() UserDto: Record<string, any>) {
    return this.usersService.resetPassword(UserDto.id)
  }

  @Delete(':id')
  DeleteUser(@Param() UserDto: Record<string, any>) { 
    return this.usersService.deleteUser(UserDto.id)
  }

  @Put('lock/:id')
  LockUser(@Param() UsersDto: Record<string, any>) {
    return this.usersService.lockUser(UsersDto.id)
  }

  @Put('unlock/:id')
  UnlockUser(@Param() UsersDto: Record<string, any>) {
    return this.usersService.unlockUser(UsersDto.id)
  }

  @Post()
  CreateUser(@Body() UserDto: Record<string, any>) {
    return this.usersService.create(UserDto.fullName, UserDto.email, UserDto.fatherName, UserDto.phoneNo, UserDto.country, UserDto.state, UserDto.city, UserDto.address, UserDto.pincode, UserDto.access, UserDto.role, UserDto.additional)
  }

  @Put(':id')
  EditUser(@Body() UserDto: Record<string, any>, @Param() UserId: Record<string, any>) {
    return this.usersService.editUser(UserDto, UserId.id)
  }

}
