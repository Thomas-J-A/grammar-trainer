import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersRepository {
  // Temporary user data (refactor to interact with db via prisma client)
  private users: User[] = [
    { id: 1, email: 'foo@icloud.com', password: 'changeme' },
    { id: 2, email: 'bar@gmail.com', password: 'guess' },
  ];

  async createUser(email: string, password: string) {
    // TODO: hash password, save to db
    const newUser = {
      id: Math.random(),
      email,
      password,
    };

    this.users = [...this.users, newUser];

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
