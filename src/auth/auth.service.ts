import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpsertUserDto } from './dtos/upsert-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: UpsertUserDto): Promise<UserResponseDto> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const maybeUser = await this.prismaService.user.create({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: UserRole.USER,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async update(id: number, user: UpsertUserDto): Promise<UserResponseDto> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const maybeUser = await this.prismaService.user.update({
      where: { id },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async updateRole(id: number, role: UserRole): Promise<UserResponseDto> {
    const maybeUser = await this.prismaService.user.update({
      where: { id },
      data: {
        role,
      },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }

  async login(
    username: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return plainToInstance(UserResponseDto, user);
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const maybeUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    return plainToInstance(UserResponseDto, maybeUser);
  }
}
