// 代码生成时间: 2025-08-07 15:09:54
import { Module } from '@nestjs/common';
import { MessageNotificationService } from './message-notification.service';
import { MessageNotificationController } from './message-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { NotificationService } from './notification.service'; // 假设我们有一个通知服务来处理通知逻辑

// MessageNotificationModule 是消息通知系统的模块
@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]), // 导入 TypeORM 模块来处理数据库操作
  ],
  controllers: [MessageNotificationController], // 控制器负责处理 HTTP 请求
  providers: [MessageNotificationService, NotificationService], // 提供者（服务）负责业务逻辑
})
export class MessageNotificationModule {}

// MessageNotificationService 服务类，负责消息通知的业务逻辑
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageNotificationService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private notificationService: NotificationService, // 注入通知服务
  ) {}

  // 发送消息并触发通知
  async sendMessage(message: string, userId: number): Promise<void> {
    try {
      const messageEntity = this.messageRepository.create({ message, userId });
      await this.messageRepository.save(messageEntity);
      await this.notificationService.notify(userId, message);
    } catch (error) {
      // 错误处理
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }
}

// MessageNotificationController 控制器类，处理 HTTP 请求
import { Controller, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MessageNotificationService } from './message-notification.service';

@Controller('messages')
export class MessageNotificationController {
  constructor(private messageNotificationService: MessageNotificationService) {}

  // 发送消息的端点
  @Post(':userId')
  async sendMessage(@Param('userId') userId: number, @Body('message') message: string): Promise<void> {
    try {
      await this.messageNotificationService.sendMessage(message, parseInt(userId));
    } catch (error) {
      // 错误处理
      throw new HttpException('Could not send message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// MessageEntity 实体类，代表数据库中的消息记录
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  userId: number;
}

// NotificationService 服务类，负责发送通知
import { Injectable } from '@nestjs/common';
import { MessageEntity } from './message.entity';

@Injectable()
export class NotificationService {
  // 模拟发送通知的方法
  async notify(userId: number, message: string): Promise<void> {
    // 这里可以添加发送通知的逻辑
    console.log(`Notification sent to user ${userId}: ${message}`);
  }
}