// 代码生成时间: 2025-08-24 02:32:47
import { Injectable } from '@nestjs/common';
import { Readable, Writable } from 'stream';
import { createGzip } from 'zlib';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream/promises';

// Promisify the pipeline function for use in async context
const pipelineAsync = promisify(pipeline);

@Injectable()
export class DataBackupRestoreService {
  /**
   * Backup the data to a file.
   * @param data The data to be backed up.
   * @param filename The name of the backup file.
   * @returns Promise<void>
   */
  async backupData(data: string, filename: string): Promise<void> {
    try {
      const gzip = createGzip();
      const backupFileStream = createWriteStream(join(process.cwd(), 'backups', filename));
      await pipelineAsync(
        new Readable({
          read() {
            this.push(data);
            this.push(null); // Indicate end of the stream
          },
        }),
        gzip,
        backupFileStream,
      );
      console.log(`Data successfully backed up to ${filename}.gz`);
    } catch (error) {
      throw new Error(`Failed to backup data: ${error.message}`);
    }
  }

  /**
   * Restore data from a backup file.
   * @param filename The name of the backup file.
   * @returns Promise<string>
   */
  async restoreData(filename: string): Promise<string> {
    try {
      const gunzip = createGzip({ finishFlush: 'gzip' });
      const backupFileStream = createReadStream(join(process.cwd(), 'backups', filename));
      const restoreFileStream = new Writable({
        write(chunk, encoding, callback) {
          this.data = chunk.toString();
          callback();
        },
      });
      await pipelineAsync(
        backupFileStream,
        gunzip,
        restoreFileStream,
      );
      console.log(`Data successfully restored from ${filename}.gz`);
      return restoreFileStream.data;
    } catch (error) {
      throw new Error(`Failed to restore data: ${error.message}`);
    }
  }
}
