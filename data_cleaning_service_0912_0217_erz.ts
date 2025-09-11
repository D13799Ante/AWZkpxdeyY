// 代码生成时间: 2025-09-12 02:17:08
import { Injectable } from '@nestjs/common';

// 定义数据清洗接口
interface DataCleaningOptions {
  removeEmptyEntries?: boolean;
  trimStrings?: boolean;
  filterByType?: 'string' | 'number';
}

@Injectable()
export class DataCleaningService {

  // 数据清洗和预处理函数
  cleanData(data: any[], options?: DataCleaningOptions): any[] {
    try {
      // 如果没有提供数据或数据为空，则直接返回空数组
      if (!data || !data.length) return [];

      // 根据选项执行数据清洗
      const cleanedData = data.map((item: any) => {
        // 去除空字符串
        if (options?.removeEmptyEntries) {
          for (const key in item) {
            if (item[key] === '' || item[key] == null) {
              delete item[key];
            }
          }
        }

        // 修剪字符串首尾空格
        if (options?.trimStrings) {
          for (const key in item) {
            if (typeof item[key] === 'string') {
              item[key] = item[key].trim();
            }
          }
        }

        // 根据类型过滤数据
        if (options?.filterByType) {
          switch (options.filterByType) {
            case 'string':
              return Object.keys(item).reduce((acc: any, key) => {
                if (typeof item[key] === 'string') acc[key] = item[key];
                return acc;
              }, {});
            case 'number':
              return Object.keys(item).reduce((acc: any, key) => {
                if (typeof item[key] === 'number') acc[key] = item[key];
                return acc;
              }, {});
            default:
              return item;
          }
        }

        return item;
      });

      return cleanedData;
    } catch (error) {
      // 处理错误并抛出异常
      throw new Error(`Data cleaning process failed: ${error.message}`);
    }
  }
}
