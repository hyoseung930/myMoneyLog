import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  encryptedAccountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountNumberIv: string;

  @IsString()
  @IsNotEmpty()
  accountType: string;

  @IsNumber()
  @IsOptional()
  balance?: number;
}

export class UpdateAccountDto {
  @IsNumber()
  @IsOptional()
  balance?: number;
}
