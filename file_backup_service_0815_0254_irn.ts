// 代码生成时间: 2025-08-15 02:54:22
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Promisify fs methods for use with async/await
const exists = promisify(existsSync);
const readFile = promisify(readFileSync);
const writeFile = promisify(writeFileSync);

@Injectable()
export class FileBackupService {
  /**
   * Backup a file to a specified directory
   * @param sourceFilePath The path to the file to be backed up
   * @param backupDirPath The directory where the backup will be stored
   * @returns Promise<void>
   */
  async backupFile(sourceFilePath: string, backupDirPath: string): Promise<void> {
    try {
      // Check if the source file exists
      if (!(await exists(sourceFilePath))) {
        throw new Error(`Source file does not exist: ${sourceFilePath}`);
      }
      
      // Create the backup directory if it does not exist
      if (!(await exists(backupDirPath))) {
        await promisify(fs.mkdir)(backupDirPath, { recursive: true });
      }
      
      // Read the source file and write it to the backup directory
      const fileContent = await readFile(sourceFilePath);
      const backupFilePath = path.join(backupDirPath, path.basename(sourceFilePath));
      await writeFile(backupFilePath, fileContent);
    } catch (error) {
      // Handle any errors that occur during the backup process
      console.error('Backup error:', error);
    }
  }

  /**
   * Synchronize files between two directories
   * @param sourceDirPath The directory to copy files from
   * @param targetDirPath The directory to copy files to
   * @returns Promise<void>
   */
  async syncFiles(sourceDirPath: string, targetDirPath: string): Promise<void> {
    try {
      // Check if both directories exist
      if (!(await exists(sourceDirPath)) || !(await exists(targetDirPath))) {
        throw new Error('Both source and target directories must exist.');
      }
      
      // Synchronize files between the two directories
      const files = await promisify(fs.readdir)(sourceDirPath);
      for (const file of files) {
        const sourceFilePath = path.join(sourceDirPath, file);
        const targetFilePath = path.join(targetDirPath, file);
        if (await exists(targetFilePath)) {
          // If the file exists, compare and update if necessary
          if (readFile(sourceFilePath, 'utf8').toString() !== readFile(targetFilePath, 'utf8').toString()) {
            await writeFile(targetFilePath, readFile(sourceFilePath));
          }
        } else {
          // If the file does not exist, copy it to the target directory
          await writeFile(targetFilePath, readFile(sourceFilePath));
        }
      }
    } catch (error) {
      // Handle any errors that occur during the synchronization process
      console.error('Sync error:', error);
    }
  }
}
