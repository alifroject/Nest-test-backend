import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserSchema } from './zod/user.schema';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import type { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(SessionAuthGuard, ThrottlerGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Throttle({ short: { limit: 10, ttl: 60 } })
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.session.user.id;
    const user = await this.userService.findOne(userId);
    return {
      success: true,
      user,
      message: 'Profile retrieved successfully',
    };
  }

  @Throttle({ short: { limit: 5, ttl: 60 } })
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() body: any) {
    const result = UpdateUserSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    const userId = req.session.user.id;
    return this.userService.update(userId, result.data);
  }

  //Admin only: get all users
  @Throttle({ short: { limit: 20, ttl: 60 } })
  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      success: true,
      users,
      message: 'All users retrieved (admin access)',
    };
  }

  //Admin only: delete user by id
  @Throttle({ short: { limit: 5, ttl: 60 } })
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return { success: true, message: `User ${id} deleted by admin` };
  }
}
