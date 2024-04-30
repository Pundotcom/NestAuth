import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(redisterDto: RegisterDto) : Promise<User>{
    const newUser = new this.userModel(redisterDto);
    return newUser.save();
  }

  async findByEmail(email :string) : Promise<UserDocument>{
    return this.userModel.findOne({email}).exec()
  }
}