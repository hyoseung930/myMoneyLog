import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  encryptedDescription?: string;

  @IsString()
  @IsOptional()
  descriptionIv?: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  accountId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  encryptedDescription?: string;

  @IsString()
  @IsOptional()
  descriptionIv?: string;
}
