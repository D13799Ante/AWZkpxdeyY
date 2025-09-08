// 代码生成时间: 2025-09-09 05:09:40
import { Module } from '@nestjs/common';
import { MemoryUsageAnalysisService } from './memory-usage-analysis.service';
import { MemoryUsageAnalysisController } from './memory-usage-analysis.controller';

@Module({
  controllers: [MemoryUsageAnalysisController],
  providers: [MemoryUsageAnalysisService],
})
export class MemoryUsageAnalysisModule {}

/**
 * MemoryUsageAnalysisService - Service for memory usage analysis.
 *
 * @class
 * @author Your Name
 * @version 1.0
 */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class MemoryUsageAnalysisService {
  /**
   * Returns the memory usage information of the server.
   *
   * @returns {Promise<{ total: number; free: number; used: number; available: number; usedPercentage: number; }>}
   */
  async getMemoryUsage(): Promise<{ total: number; free: number; used: number; available: number; usedPercentage: number; }> {
    try {
      const total = os.totalmem();
      const free = os.freemem();
      const used = total - free;
      const available = free;
      const usedPercentage = (used / total) * 100;
      return { total, free, used, available, usedPercentage };
    } catch (error) {
      throw new HttpException('Error retrieving memory usage information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

/**
 * MemoryUsageAnalysisController - Controller for handling memory usage analysis.
 *
 * @class
 * @author Your Name
 * @version 1.0
 */
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MemoryUsageAnalysisService } from './memory-usage-analysis.service';

@Controller('memory')
export class MemoryUsageAnalysisController {
  constructor(private readonly memoryUsageAnalysisService: MemoryUsageAnalysisService) {}

  /**
   * Endpoint to get memory usage information.
   *
   * @param {Response} res - The response object.
   * @returns {Response} - The response object with memory usage data.
   */
  @Get('usage')
  async getMemoryUsage(@Res() res: Response): Promise<Response> {
    try {
      const memoryUsage = await this.memoryUsageAnalysisService.getMemoryUsage();
      return res.status(200).json(memoryUsage);
    } catch (error) {
      return res.status(error.getStatus()).json({ message: error.getResponse() });
    }
  }
}