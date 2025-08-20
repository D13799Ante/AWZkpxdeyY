// 代码生成时间: 2025-08-21 01:48:29
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class ScheduledTasksModule {}

/*
 * tasks.service.ts
 *
 * This service contains the logic for scheduling and executing tasks.
 */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor() {}

  @Cron(CronExpression.EVERY_5_SECONDS) // This task will run every 5 seconds
  handleCron() {
    console.log('Running a 5 second task');
    try {
      // Perform the task logic here
      // For example, a database operation or a file processing job
      // ...
    } catch (error) {
      // Handle any errors that occur during the task execution
      console.error('Error in scheduled task:', error);
    }
  }
}

/*
 * tasks.controller.ts
 *
 * This controller provides an endpoint to manually trigger tasks.
 */
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('run-now')
  runTaskNow(): string {
    this.tasksService.handleCron();
    return 'Task executed manually';
  }
}
