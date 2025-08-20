// 代码生成时间: 2025-08-20 14:17:27
import { Module } from '@nestjs/common';
import { ThemeSwitchService } from './theme-switch.service';
import { ThemeSwitchController } from './theme-switch.controller';
import { ThemeSwitchGateway } from './theme-switch.gateway';

@Module({
  providers: [ThemeSwitchService, ThemeSwitchGateway],
  controllers: [ThemeSwitchController],
})
export class ThemeSwitchModule {}

/**
 * ThemeSwitchService
 * Service responsible for handling theme switching logic.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTheme } from './user-theme.entity';

@Injectable()
export class ThemeSwitchService {
  constructor(
    @InjectRepository(UserTheme)
    private readonly userThemeRepository: Repository<UserTheme>,
  ) {}

  /**
   * Switches the theme for the given user.
   * @param userId The ID of the user.
   * @param theme The new theme to be applied.
   * @returns A promise that resolves when the theme is switched successfully.
   */
  async switchTheme(userId: string, theme: string): Promise<void> {
    const userTheme = await this.userThemeRepository.findOne({ where: { userId } });
    if (!userTheme) {
      throw new Error('User theme not found.');
    }
    userTheme.theme = theme;
    await this.userThemeRepository.save(userTheme);
  }
}

/**
 * ThemeSwitchController
 * Controller responsible for handling HTTP requests related to theme switching.
 */
import { Controller, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ThemeSwitchService } from './theme-switch.service';

@Controller('theme')
export class ThemeSwitchController {
  constructor(private readonly themeSwitchService: ThemeSwitchService) {}

  /**
   * Switches the theme for the specified user.
   * @param userId The ID of the user.
   * @param theme The new theme to be applied.
   * @returns A message indicating the theme has been switched.
   */
  @Post(':userId/switch-theme')
  async switchUserTheme(@Param('userId') userId: string, @Body('theme') theme: string): Promise<string> {
    try {
      await this.themeSwitchService.switchTheme(userId, theme);
      return `Theme switched to ${theme} for user ${userId}.`;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

/**
 * ThemeSwitchGateway
 * Gateway responsible for handling WebSocket connections.
 */
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ThemeSwitchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  /**
   * Broadcasts the theme change to all connected clients.
   * @param payload The payload containing user ID and theme.
   */
  @SubscribeMessage('themeChange')
  handleThemeChange(@MessageBody() payload: { userId: string; theme: string }): void {
    this.server.emit('themeChange', payload);
  }
}

/**
 * UserTheme.entity
 * Entity representing the user's theme preferences.
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserTheme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  theme: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
