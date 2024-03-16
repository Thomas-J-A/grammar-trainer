import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  // constructor() {
  // inject users.repository.ts
  // }

  // Temporary user data
  private users: User[] = [
    { id: 1, email: 'foo@icloud.com', password: 'changeme' },
    { id: 2, email: 'bar@gmail.com', password: 'guess' },
  ];

  async createUser(email: string, password: string) {
    // const newUser = await this.UsersRepository.createrUser(email, password); (hash password, save to db)

    const newUser = {
      id: Math.random(),
      email,
      password,
    };

    this.users = [...this.users, newUser];

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // call UsersRepository to check for user by email
    // return user

    return this.users.find((user) => user.email === email) ?? null;
  }

  async findUserById(id: number): Promise<User | null> {
    // call UsersRepository to look for user by id (throw exceptions in that class method)
    // return user
    return this.users.find((user) => user.id === id) ?? null;
  }
}
