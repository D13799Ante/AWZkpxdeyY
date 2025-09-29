// 代码生成时间: 2025-09-29 15:41:46
import { Module } from '@nestjs/common';
import { AbTestService } from './ab-test.service';
import { AbTestController } from './ab-test.controller';

// A/B测试模块
@Module({
  imports: [],
  controllers: [AbTestController],
  providers: [AbTestService],
})
export class AbTestModule {}

// A/B测试控制器
import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AbTestService } from './ab-test.service';

@Controller('ab-test')
export class AbTestController {
  constructor(private readonly abTestService: AbTestService) {}

  @Get('start')
  async startTest(@Body() body: any): Promise<any> {
    try {
      return await this.abTestService.startTest(body);
    } catch (error) {
      throw new HttpException('Failed to start A/B test', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('results')
  async getTestResults(@Body() body: any): Promise<any> {
    try {
      return await this.abTestService.getTestResults(body);
    } catch (error) {
      throw new HttpException('Failed to retrieve A/B test results', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// A/B测试服务
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AbTestService {
  private readonly tests = new Map<string, any>();

  async startTest(body: any): Promise<any> {
    if (!body || !body.name || !body.groups) {
      throw new Error('Invalid A/B test configuration');
    }

    const testId = uuid();
    this.tests.set(testId, {
      id: testId,
      name: body.name,
      groups: body.groups,
      startedAt: new Date()
    });

    return { testId, message: 'A/B test started successfully' };
  }

  async getTestResults(body: any): Promise<any> {
    if (!body || !body.testId) {
      throw new Error('Invalid A/B test ID');
    }

    const test = this.tests.get(body.testId);
    if (!test) {
      throw new Error('A/B test not found');
    }

    return test;
  }
}
