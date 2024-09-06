import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { TeamsService } from 'src/teams/teams.service';
import { Team } from 'src/teams/teams.schema';
import * as nodemailer from 'nodemailer'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => TeamsService)) private readonly teamService: TeamsService,
    private jwtService: JwtService
  ) {}

  async findOne(userId: string): Promise<[User, Team[]] | undefined> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    const teams = await this.teamService.getTeams(user.teams)
    return [user, teams]
  }

  async login(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOneAndUpdate({ email }, { loggedIn: true }).exec()
    return user
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findSome(_id: ObjectId[]): Promise<User[]> {
    const users = await this.userModel.find({_id: _id}).exec()
    return users
  }

  async findAndUpdateTeams(userIds: ObjectId[], teamId: ObjectId, removed?: ObjectId[]): Promise<null> {
    
    const users = await this.userModel.find({ _id: { $in: userIds } });

    const added = users.filter(user => !user.teams.includes(teamId) )

    await Promise.all(added.map(async (user) => {
      user.teams.push(teamId); 
      await user.save();
    }));

    if(removed) {
      const removedUsers = await this.userModel.find({ _id: { $in: removed } });
      await Promise.all(removedUsers.map(async (user) => {
        const index = user.teams.indexOf(teamId)
        user.teams.splice(index, 1);
        await user.save();
      }));
    }
  
    return;
  }

  async passwordMail(newUser: User, type: number) {
    const transporter = nodemailer.createTransport({
      host: process.env.host,
      port: process.env.port,
      secure: false,     
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    transporter.verify(function(error, success) {
      if (error) {
        console.log('SMTP connection error:', error);
      } else {
        console.log('SMTP connection successful:', success);
      }
    });
    

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #007bff;
            color: #ffffff;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.5;
          }
          .content p {
            margin: 0 0 20px;
          }
          .button {
            display: block;
            width: 100%;
            text-align: center;
            margin: 20px 0;
          }
          .button a {
            background-color: #0070f3;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Platform</h1>
          </div>
          <div class="content">
            <p>Hello ${newUser.fullName},</p>
            <p>Thank you for joining our platform! To get started, please set your password by clicking the button below:</p>
            <div class="button">
              <a href="http://localhost:3000/reset/${newUser.resetToken}" target="_blank">Set Your Password</a>
            </div>
            <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
            <p>${process.env.origin}/reset/${newUser.resetToken}</p>
            <p>Best regards,<br>The Team</p>
          </div>
          <div class="footer">
            <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: 'thaneshk1045@gmail.com',
      to: newUser.email,
      subject: `Set Your Password ${ type === 0 ? '- Welcome to Our Platform' : '' }`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

  }

  async create(
    fullName: string,
    email: string, 
    fatherName: string,
    phoneNo: number,
    country: string, 
    state: string,
    city: string,
    address: string,
    pincode: string,
    access: number,
    role: string,
    additional: any
  ): Promise<User | {msg: string}> {
    let newUser;
    try {
      newUser = new this.userModel({
        fullName,
        email,
        fatherName,
        resetToken: await this.jwtService.signAsync({ fullName }),
        phoneNo,
        country,
        state,
        city,
        address,
        pincode,
        access,
        role,
        additional,
      });

      await newUser.save();

      await this.passwordMail(newUser, 0);

    } catch (error) {
      console.log('Creation Error:', error.message);
      return { msg: 'Creation Error: User' };
    }

    return newUser;
  }

  async setPassword(password: string, resetToken: string): Promise<User> {
    const user = (await this.userModel.findOneAndUpdate({ resetToken }, {password: password, resetToken: ''}))
    return user
  }

  async resetPassword(userId: string): Promise<User> {
    const fullName = await this.userModel.findOne({ _id: userId })
    const user = await this.userModel.findOneAndUpdate({ _id: userId }, {
      resetToken: await this.jwtService.signAsync({ fullName }),
    }, { new: true })

    await this.passwordMail(user, 0);

    return user
  }

  async deleteUser(id: ObjectId): Promise<{msg: string}> {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec()

    await this.teamService.removeDeletedUser(id, user.teams)

    return {
      msg: 'User Deleted Successfully'
    }
  }

  async deleteTeam(ids: ObjectId[], id: ObjectId) {
    const users = await this.userModel.find({ _id: ids }).exec()

    await Promise.all(users.map(async (user) => {
      const index = user.teams.indexOf(id)
      user.teams.splice(index, 1);
      await user.save();
    }));
  }

  async lockUser(userId: string): Promise<{msg: string}> {
    await this.userModel.findOneAndUpdate({ _id: userId }, { locked: true }).exec()
    return {
      msg: 'User access locked'
    }
  }

  async unlockUser(userId: string): Promise<{msg: string}> {
    await this.userModel.findOneAndUpdate({ _id: userId }, { locked: false }).exec()
    return {
      msg: 'User access unlocked'
    }
  }

  async editUser(userData: any, _id: string): Promise<null> {
    await this.userModel.findOneAndUpdate({ _id: _id}, userData)
    return
  }

  async getResetToken(resetToken: string): Promise<{resetToken: string}> {
    return { resetToken: (await this.userModel.findOne({ resetToken })).resetToken }
  }

}
