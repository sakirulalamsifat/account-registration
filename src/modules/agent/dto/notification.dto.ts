import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly KEYWORD: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly SourceMsisdn: string;

  @ApiProperty()
  readonly templateID: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly LANG: string;
}

export class NotificationTransaction {}
export class NotificationBalanceDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly KEYWORD: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly SourceMsisdn: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly Amount: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly RewardPoints: number;

  @ApiProperty()
  readonly templateID: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly LANG: string;
}

export class NotificationPinChangeDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly KEYWORD: string;

  @ApiProperty()
  readonly SourceMsisdn: string;


  @IsNotEmpty()
  @ApiProperty()
  readonly PIN: string;

  @ApiProperty()
  readonly templateID: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly LANG: string;
}
