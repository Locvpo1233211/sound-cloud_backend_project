import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { user, userDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import aqp from 'api-query-params';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name)
    private userModel: Model<user>,
    private configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    let email = createUserDto.email;
    let checkEmail = await this.userModel.findOne({ email });
    if (checkEmail) {
      throw new BadRequestException('Email already exists');
    }
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = createUserDto.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);
    createUserDto.password = hash;
    console.log(createUserDto);
    return await this.userModel.create(createUserDto);
  }

  async findAll(current, pageSize, params) {
    console.log(current, pageSize, params);

    let { filter, projection, population, sort } = aqp(params);
    delete filter.pageSize;
    delete filter.current;
    let offset = (+current - 1) * pageSize;
    let defaultLimit = pageSize ? +pageSize : 10;
    const total = (await this.userModel.find(filter)).length;
    const pages = Math.ceil(total / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .select('-password')
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
      .exec();
    return {
      meta: {
        total,
        pages,
        current,
        pageSize,
      },
      result,
    };
  }

  async findAllWithout() {
    const result = await this.userModel
      .find({})
      .select('-password')
      .sort('desc')
      .exec();
    return {
      result,
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongo.ObjectId.isValid(id)) {
      return {
        message: 'Id không hợp lệ',
      };
    }
    return this.userModel.updateOne(
      {
        _id: id,
      },
      updateUserDto,
    );
  }

  remove(id: string) {
    if (!mongo.ObjectId.isValid(id)) {
      return {
        message: 'Id không hợp lệ',
      };
    }
    return this.userModel.deleteOne({ _id: id });
  }
}
