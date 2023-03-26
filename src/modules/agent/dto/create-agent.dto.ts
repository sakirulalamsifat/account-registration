import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  isEmpty,
  isBoolean,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAgentbankingDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly Keyword: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly Source_Wallet_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Dest_Wallet_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Amount: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Transaction_Fee: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Transaction_Comm: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Charge_Payer: bigint;
  @ApiProperty()
  readonly Currency: string;
  @ApiProperty()
  readonly Reference_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Comission_Receiver: bigint;
  @ApiProperty()
  readonly Language: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  readonly PIN: bigint;
}

export class OffnetWithdrawalDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly Keyword: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly Source_Wallet_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Dest_Wallet_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Amount: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Transaction_Fee: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Transaction_Comm: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Charge_Payer: bigint;
  @ApiProperty()
  readonly Currency: string;
  @ApiProperty()
  readonly Reference_ID: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly Comission_Receiver: bigint;
  @ApiProperty()
  readonly Language: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly PIN: number;
  @IsNotEmpty()
  @ApiProperty()
  readonly OFFNETPIN: number;
}
