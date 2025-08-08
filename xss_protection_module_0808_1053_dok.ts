// 代码生成时间: 2025-08-08 10:53:00
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { XssGuard } from './xss.guard';

// A NestJS module that provides XSS protection
@Module({
  // No providers are needed in this implementation, as guards are used
})
export class XssProtectionModule {

  // Method to configure middleware and guards
  configure(consumer: MiddlewareConsumer): void {
    consumer
      // Apply the XSS guard to all routes
      .apply(XssGuard)
      // Apply the guard to both incoming requests and outgoing responses
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

// XSS Guard Implementation
// Intercepts HTTP requests and responses to prevent XSS attacks
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { XssFilter } from './xss.filter';

@Injectable()
export class XssGuard implements CanActivate {
  // Check if the guard should activate (i.e., apply the filter)
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return XssFilter.filter(request, response);
  }
}

// XSS Filter Implementation
// Filters out potentially malicious data to prevent XSS attacks
import { Request, Response } from 'express';
import * as sanitizeHtml from 'sanitize-html';

export class XssFilter {
  // Method to sanitize the request and response to prevent XSS
  static filter(request: Request, response: Response): boolean {
    try {
      // Sanitize the request body
      if (request.body) {
        request.body = sanitizeHtml(request.body, {
          allowedTags: [], // No tags allowed to prevent XSS
          allowedAttributes: {},
          allowedSchemes: {},
          nonTextTags: [],
          parser: new DOMParser()
        });
      }
      // Sanitize the response body
      const originalSend = response.send;
      response.send = function (body) {
        if (typeof body === 'string') {
          return originalSend.call(response, sanitizeHtml(body));
        }
        return originalSend.apply(response, arguments);
      };
      return true;
    } catch (error) {
      // Handle any errors during the sanitization process
      console.error('XSS Filter Error:', error);
      return false;
    }
  }
}
