// 代码生成时间: 2025-09-03 21:08:33
import { Module, HttpException, Logger } from '@nestjs/common';
# 优化算法效率
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorResponseInterceptor } from './error_response.interceptor';
import { AllExceptionsFilter } from './all_exceptions.filter';
# NOTE: 重要实现细节

// Error Logger Module
@Module({
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
# 添加错误处理
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorResponseInterceptor,
    },
  ],
})
export class ErrorLoggerModule {}
