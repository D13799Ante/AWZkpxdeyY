// 代码生成时间: 2025-08-29 07:26:53
import { Module, Global, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}

/**
 * Notification Service - Business logic for sending notifications.
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  /**
   * Send a notification to a user.
   * @param userId the ID of the user to send the notification to.
   * @param message the message to be sent.
   */
  async sendNotification(userId: string, message: string): Promise<void> {
    const newNotification = this.notificationRepository.create({
      userId,
      message,
    });
    try {
      await this.notificationRepository.save(newNotification);
    } catch (error) {
      throw new HttpException(
        'Failed to send notification.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

/**
 * Notification Controller - Handles HTTP requests for notifications.
 */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Endpoint to send a notification.
   * @param userId the ID of the user to send the notification to.
   * @param message the message to be sent.
   */
  @Post()
  async create(
    @Body('userId') userId: string,
    @Body('message') message: string,
  ): Promise<void> {
    if (!userId || !message) {
      throw new BadRequestException('User ID and message are required.');
    }
    await this.notificationService.sendNotification(userId, message);
  }
}

/**
 * Notification Entity - ORM entity for notifications.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  message: string;
}