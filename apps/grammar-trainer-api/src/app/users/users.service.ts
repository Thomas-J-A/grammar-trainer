import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(email: string, password: string) {
    return await this.usersRepository.createUser(email, password);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findUserByEmail(email);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findUserById(id);
  }
}
