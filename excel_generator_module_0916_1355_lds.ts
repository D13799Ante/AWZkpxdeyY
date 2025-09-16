// 代码生成时间: 2025-09-16 13:55:23
import { Module } from '@nestjs/common';
import { ExcelGeneratorService } from './excel-generator.service';
import { ExcelGeneratorController } from './excel-generator.controller';
import * as ExcelJS from 'exceljs';
import { ExcelJSModule } from 'nestjs-exceljs';

@Module({
  imports: [ExcelJSModule],
  controllers: [ExcelGeneratorController],
  providers: [ExcelGeneratorService],
})
export class ExcelGeneratorModule {}

/**
 * ExcelGeneratorService
 * Service responsible for generating Excel files.
 */
import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { InjectLogger } from 'nestjs-log4js';
import { Logger } from 'log4js';

@Injectable()
export class ExcelGeneratorService {
  constructor(
    @InjectLogger(ExcelGeneratorService.name) private logger: Logger,
  ) {}

  /**
   * Generates a new Excel workbook with a single sheet.
   * @param data Data to populate the Excel sheet.
   * @returns Returns a Promise with the Excel workbook.
   */
  async generateExcel(data: any[]): Promise<Workbook> {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
      worksheet.columns = this.getColumns();
      worksheet.addRow(data);
      return workbook;
    } catch (error) {
      this.logger.error('Error generating Excel workbook:', error);
      throw new Error('Failed to generate Excel workbook');
    }
  }

  /**
   * Maps the data structure to columns in the Excel sheet.
   * @returns Returns an array of column definitions.
   */
  private getColumns(): ExcelJS.Column[] {
    return [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'Description', key: 'description', width: 40 },
    ];
  }
}

/**
 * ExcelGeneratorController
 * Controller responsible for handling Excel generation requests.
 */
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExcelGeneratorService } from './excel-generator.service';
import { Workbook } from 'exceljs';

@Controller('excel')
export class ExcelGeneratorController {
  constructor(private readonly excelGeneratorService: ExcelGeneratorService) {}

  /**
   * Endpoint to generate and download an Excel file.
   * @param data Data to populate the Excel file.
   * @param res Express response object.
   */
  @Post('generate')
  async generateExcelFile(@Body() data: any[], @Res() res: Response) {
    try {
      const workbook: Workbook = await this.excelGeneratorService.generateExcel(data);
      const buffer = await workbook.xlsx.writeBuffer();
      res.status(HttpStatus.OK)
        .setHeader('Content-Disposition', 'attachment; filename=generated.xlsx')
        .setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .send(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to generate Excel file');
    }
  }
}

