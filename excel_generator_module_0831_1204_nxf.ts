// 代码生成时间: 2025-08-31 12:04:34
import { Module } from '@nestjs/common';
import { ExcelGeneratorService } from './excel_generator.service';
import { ExcelGeneratorController } from './excel_generator.controller';
import { ExcelModule } from 'nest-excel';

// Excel表格自动生成器模块
@Module({
  imports: [ExcelModule],
  controllers: [ExcelGeneratorController],
  providers: [ExcelGeneratorService],
})
export class ExcelGeneratorModule {}

// Excel生成器服务
import { Injectable } from '@nestjs/common';
import { ExcelService } from 'nest-excel';
import { InjectModel } from 'nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExcelData } from './interfaces/excel-data.interface';

@Injectable()
export class ExcelGeneratorService {
  constructor(
    private readonly excelService: ExcelService,
    @InjectModel(ExcelData.name) private readonly model: Model<ExcelData>,
  ) {}

  // 生成Excel表格
  async generateExcel(data: ExcelData): Promise<void> {
    try {
      await this.excelService.generate({
        data: this.model.find(),
        filename: 'example.xlsx',
        header: {
          key: 'value',
        },
      });
    } catch (error) {
      throw new Error('Failed to generate Excel file');
    }
  }
}

// Excel生成器控制器
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExcelGeneratorService } from './excel_generator.service';
import { ExcelData } from './interfaces/excel-data.interface';

@Controller('excel')
export class ExcelGeneratorController {
  constructor(private readonly excelService: ExcelGeneratorService) {}

  // 获取Excel表格
  @Get('generate')
  async generateExcel(@Res() res: Response): Promise<void> {
    try {
      await this.excelService.generateExcel({ key: 'value' } as ExcelData);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
      res.send();
    } catch (error) {
      throw new Error('Failed to generate Excel file');
    }
  }
}

// Excel数据接口
export interface ExcelData {
  key: string;
  value: string;
}
