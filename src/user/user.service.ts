import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // <-- Injected DB repository
  ) { }

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {

    const { email } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException({message: 'Email already exist'});
    }

    const user = this.userRepository.create(createUserDto); // Create entity instance
    return await this.userRepository.save(user);            // Save to DB
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return await this.userRepository.find(); // SELECT * FROM "user"
  }

  // READ ONE
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // UPDATE
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto); // Merge existing + new data
    return await this.userRepository.save(user);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
