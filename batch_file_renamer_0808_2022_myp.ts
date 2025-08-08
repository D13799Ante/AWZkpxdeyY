// 代码生成时间: 2025-08-08 20:22:00
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Readable } from 'stream';

@Injectable()
export class BatchFileRenamerService {
  // Function to rename a single file
  private async renameFile(oldPath: string, newPath: string): Promise<void> {
# FIXME: 处理边界情况
    try {
      await fsPromises.rename(oldPath, newPath);
    } catch (error) {
      throw new Error(`Error renaming file from ${oldPath} to ${newPath}: ${error}`);
    }
  }
# TODO: 优化性能

  // Function to generate new file names based on a pattern
  private generateNewFileNames(files: string[], pattern: string): string[] {
    return files.map((file, index) => {
      const baseName = file.replace(/\.[^./\]*$/, '');
      return `${baseName}_${pattern}_${index + 1}.ext`;
    });
  }

  // Function to rename all files in a directory based on a pattern
  public async renameFilesInDirectory(directoryPath: string, pattern: string): Promise<void> {
# 增强安全性
    try {
      // Read files in the directory
      const files = await fsPromises.readdir(directoryPath);
# TODO: 优化性能

      // Generate new file names
      const newFileNames = this.generateNewFileNames(files, pattern);

      // Rename each file
      for (let i = 0; i < files.length; i++) {
        const oldPath = join(directoryPath, files[i]);
        const newPath = join(directoryPath, newFileNames[i]);
        await this.renameFile(oldPath, newPath);
      }
    } catch (error) {
      throw new Error(`Error in renaming files in directory ${directoryPath}: ${error}`);
    }
  }
}
