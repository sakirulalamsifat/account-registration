import { IsNotEmpty, MinLength, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'Keyword should be 4 character' })
  @ApiProperty()
  readonly KEYWORD: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly StartDate: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly EndDate: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly MSISDN: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly LANG: string;
}
export class TransactionTopDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'Keyword should be 4 character' })
  @ApiProperty()
  readonly KEYWORD: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly MSISDN: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, { message: 'PIN should be  6 digit' })
  readonly PIN: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly LANG: string;
}
export class BalanceDto {
  @IsNotEmpty({ message: 'Keyword Can not be empty' })
  @ApiProperty()
  @IsString()
  @Length(4, 4, { message: 'Keyword should be 4 character' })
  readonly KEYWORD: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  readonly MSISDN: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, { message: 'PIN should be  6 digit' })
  readonly PIN: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly LANG: string;
}

export class PinChangeDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'Keyword should be 4 character' })
  @ApiProperty()
  readonly KEYWORD: string;
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  readonly MSISDN: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly OLDPIN: string;
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'PIN should be  6 digit' })
  @ApiProperty()
  readonly NEWPIN: string;

  @ApiProperty()
  readonly LANG: string;
}
