import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpsertUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  name: string;
}
