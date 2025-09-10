// 代码生成时间: 2025-09-10 10:57:18
import { Module, Global, HttpModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { XssGuardPipe } from './xss-guard.pipe';

// @Global() 装饰器用于标记模块为全局模块，这样我们可以在应用的任何部分注入 XssGuardPipe
@Global()
@Module({
  imports: [HttpModule],
  providers: [
    //{ provide: APP_PIPE, useClass: XssGuardPipe}, // Uncomment this line to apply the pipe globally
  ],
})
export class XssProtectionModule {
  // 在此可以添加静态方法或属性以支持模块功能
}

/*
 * XssGuardPipe 用于防止 XSS 攻击，通过清理用户输入来实现。
 * 它是一个管道，可以在应用的任何部分使用，以确保输入数据的安全性。
 */
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { sanitize } from 'dompurify';

@Injectable()
export class XssGuardPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 检查值是否是字符串
    if (typeof value === 'string') {
      try {
        // 使用 dompurify 清理字符串以防止 XSS 攻击
        const cleanValue = sanitize(value);
        // 如果清理后的值与原始值不同，则可能存在 XSS 风险
        if (cleanValue !== value) {
          throw new BadRequestException('XSS attack detected.');
        }
        return cleanValue;
      } catch (error) {
        // 处理异常，例如日志记录或其他错误处理
        throw new BadRequestException('XSS attack detected.');
      }
    }
    // 如果值不是字符串，则直接返回
    return value;
  }
}
