import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
