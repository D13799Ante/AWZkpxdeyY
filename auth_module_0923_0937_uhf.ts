// 代码生成时间: 2025-09-23 09:37:34
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from './users/users.module';
import { JwtConstants } from './constants';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from './jwt.service';

// AuthModule is the main module for user authentication
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService],
})
export class AuthModule {}

// AuthService is responsible for handling authentication logic
import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UsersService } from './users/users.service';
import { JwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials and return a JWT if valid
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generate JWT based on user payload
  async login(user: any) {
    // Check user exists
    if (!user) {
      throw new Error('User not found');
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

// JwtStrategy is a Passport strategy for JWT authentication
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true, // allows us to pass the request to the validate function
    });
  }

  async validate(req: Request, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// JwtService is a utility for handling JWT operations
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(payload: any): string {
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '60s' });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, jwtConstants.secret);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

// Constants for JWT secret and expiration
export const JwtConstants = {
  secret: 'secretKey',
  expiresIn: '60s',
};

// Constants module
import { Module } from '@nestjs/common';
import { JwtConstants } from './constants';

@Module()
export class ConstantsModule {}

// UserController is the controller for user authentication operations
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

// LocalAuthGuard guards the login route
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return can;
  }
}

// JwtAuthGuard guards routes that require JWT authentication
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const exceptionOrAccess = this.handleRequest(request);
    if (exceptionOrAccess instanceof UnauthorizedException) {
      throw exceptionOrAccess;
    }
    return true;
  }
}
