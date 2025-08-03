// 代码生成时间: 2025-08-03 18:12:18
 * This service is designed to be easily understandable, maintainable, and extensible.
 */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import * as decompress from 'decompress';
import { promisify } from 'util';
import { pipeline } from 'stream';

@Injectable()
export class DecompressFileService {
  // Promisify the pipeline function for better error handling and async/await support
  private readonly pipelineAsync = promisify(pipeline);

  constructor() {}

  /**
   * Decompress a file from the given source to the specified destination.
   * @param sourcePath The path to the compressed file.
   * @param destinationPath The path where the decompressed files will be placed.
   * @returns A promise that resolves when the decompression is complete.
   */
  async decompressFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      // Check if the source file exists
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`The file at ${sourcePath} does not exist.`);
      }

      // Create the destination directory if it does not exist
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      // Use decompress package to decompress the file
      await decompress(sourcePath, destinationPath);

      console.log('File decompressed successfully.');
    } catch (error) {
      // Handle errors such as file not found, or decompression failure
      console.error('An error occurred during decompression:', error.message);
      throw new Error(`Decompression failed: ${error.message}`);
    }
  }

  /**
   * Compress a file or directory into a zip archive.
   * @param sourcePath The path to the file or directory to be compressed.
   * @param destinationPath The path where the zip archive will be saved.
   * @returns A promise that resolves when the compression is complete.
   */
  async compressFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      // Check if the source exists
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`The path at ${sourcePath} does not exist.`);
      }

      // Create a write stream to the destination file
      const output = fs.createWriteStream(destinationPath);
      const archive = archiver('zip', { zlib: { level: 9 } }); // Sets the compression level

      // Listen for all archive data to be written
      output.on('close', function () {
        console.log(`Archive created with ${archive.pointer()} total bytes`);
      });

      // Listen for warnings (not errors)
      archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
          console.warn(`Archiver warning: ${err}`);
        } else {
          throw err;
        }
      });

      // Pipe archive data to the file
      await this.pipelineAsync(archive, output);
      archive.pipe(output);
      archive.directory(sourcePath, path.basename(sourcePath));
      archive.finalize();

    } catch (error) {
      // Handle errors such as source path not found, or compression failure
      console.error('An error occurred during compression:', error.message);
      throw new Error(`Compression failed: ${error.message}`);
    }
  }
}
