import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ModuleRef } from '@nestjs/core';
import { ContextIdFactory } from '@nestjs/core';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const pass = password.split('|');
    console.log(username);
    console.log(password);

    const user = await this.authService.validateUser(
      username,
      pass[0],
      pass[1],
      pass[2],
      pass[3],
      pass[4],
      pass[5],
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
