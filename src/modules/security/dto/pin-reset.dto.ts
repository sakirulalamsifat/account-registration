import { IsNotEmpty, MinLength, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PinResetDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'Keyword should be 4 character' })
  @ApiProperty()
  readonly KEYWORD: string;
  
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  readonly MSISDN: string;

  @ApiProperty()
  readonly LANG: string;
}
