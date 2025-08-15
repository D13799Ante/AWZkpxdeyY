// 代码生成时间: 2025-08-15 11:44:00
 * Handles login requests and returns authentication tokens.
 *
 * @module AuthController
 * @author Your Name
 * @version 1.0
 */

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { User } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint that authenticates user credentials.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {UserLoginDto} loginDto - User login DTO containing credentials.
   * @returns {Promise<string>} - A promise that resolves with a JWT token.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response, @User() user: any): Promise<string> {
    try {
      const token = await this.authService.login(user);
      return res.json({
        accessToken: token,
        expiresIn: 3600,
        tokenType: 'Bearer',
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Endpoint to validate user token and return user information.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {any} user - The authenticated user object.
   * @returns {Promise<object>} - A promise that resolves with user information.
   */
  @UseGuards(AuthGuard())
  @Post('validate')
  async validateUser(@Req() req: Request, @Res() res: Response, @User() user: any): Promise<object> {
    try {
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
