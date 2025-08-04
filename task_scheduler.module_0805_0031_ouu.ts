// 代码生成时间: 2025-08-05 00:31:19
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

/**
 * TaskSchedulerModule provides a module that initializes the scheduler and its tasks.
 * It uses NestJS's built-in scheduling capabilities to run scheduled tasks.
 */
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TaskSchedulerModule {}

/**
 * TasksService is a service responsible for defining and executing scheduled tasks.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService implements OnModuleInit {
  /**
   * Constructor for TasksService.
   */
  constructor() {} 

  /**
   * OnModuleInit hook is used to run code when the module is initialized.
   */
  onModuleInit() {
    console.log('TasksService is initialized and ready to schedule tasks.');
  }

  /**
   * A task that runs every 5 seconds.
   * @throws Error if the task fails to execute.
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  handleFiveSecondInterval(): void {
    console.log('Running a task every 5 seconds');
  }

  /**
   * A task that runs once a day at midnight.
   * @throws Error if the task fails to execute.
   */
  @Cron('0 0 0 * * *')
  handleOnceADay(): void {
    console.log('Running once a day at midnight');
  }
}
