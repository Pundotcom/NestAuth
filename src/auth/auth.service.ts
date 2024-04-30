import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();
      return {
        email: result.email,
        userId: result._id,
      };
    }
    return null;
  }

  async login(user: any) {
    console.log('user ,' , user)
    const payload = { email: user.email, sub: user.userId };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // เพิ่ม google Login เข้ามา
  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, name, picture, googleId } = req.user;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        name,
        picture,
        googleId,
      });
      await user.save();
    }

    const payload = { email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
