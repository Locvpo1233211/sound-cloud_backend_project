import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let result = await this.userService.create(createUserDto);
    return result;
  }

  @Get()
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() params,
  ) {
    return this.userService.findAll(current, pageSize, params);
  }
  @Get('all')
  async findAllWithout() {
    return await this.userService.findAllWithout();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    let result = await this.userService.update(id, updateUserDto);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
