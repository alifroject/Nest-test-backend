import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './zod/user.schema';
import { UserWithPassword } from './types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  // CREATE
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException({ message: 'Email already exist' });
    }

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  // READ ALL
  async findAll() {
    return await this.prisma.user.findMany();
  }

  // READ ONE
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }


  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user as UserWithPassword;
  }


  // UPDATE
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists first
    await this.findOne(id);

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
