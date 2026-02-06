import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(userData: {
    username: string;
    nickname: string;
    password: string;
    encryptedMasterKeyByPassword: string;
    encryptedMasterKeyByRecovery: string;
    passwordSalt: string;
    recoverySalt: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        username: userData.username,
        nickname: userData.nickname,
        password: userData.password,
        encryptedMasterKeyByPassword: userData.encryptedMasterKeyByPassword,
        passwordSalt: userData.passwordSalt,
        encryptedMasterKeyByRecovery: userData.encryptedMasterKeyByRecovery,
        recoverySalt: userData.recoverySalt,
      },
    });
  }
}
