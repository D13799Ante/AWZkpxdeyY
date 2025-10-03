// 代码生成时间: 2025-10-04 03:55:17
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
# NOTE: 重要实现细节
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

/**
 * ScheduledTasksModule is the module that handles the scheduled tasks.
 * It uses NestJS's ScheduleModule to create a cron job.
 */
# 改进用户体验
@Module({
  imports: [
    ScheduleModule.forRoot(),
# 添加错误处理
  ],
# 添加错误处理
  controllers: [TasksController],
  providers: [TasksService],
})
# 改进用户体验
export class ScheduledTasksModule {}