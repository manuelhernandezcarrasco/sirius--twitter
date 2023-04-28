import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class TokenDTO {
  token!: string;
  uploadURL?: string;
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsBoolean()
  private?: boolean;

  @IsOptional()
  profilePicture?: string;

  constructor(email: string, username: string, password: string, profilePicture?: string) {
    this.email = email
    this.password = password
    this.username = username
    this.profilePicture = profilePicture
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
