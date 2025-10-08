import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserSchema,
  UpdateUserSchema,
  CreateUserDto,
  UpdateUserDto,
} from './zod/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    const result = CreateUserSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }
    return this.userService.create(result.data);
  }

  @Get()
  async findAll() {
    const user = await this.userService.findAll();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const result = UpdateUserSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return this.userService.update(+id, result.data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
