import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  encryptedMasterKeyByPassword: string;

  @IsString()
  @IsNotEmpty()
  encryptedMasterKeyByRecovery: string;

  @IsString()
  @IsNotEmpty()
  passwordSalt: string;

  @IsString()
  @IsNotEmpty()
  recoverySalt: string;

  @IsString()
  @IsNotEmpty()
  recoveryKey: string;
}
