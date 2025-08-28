// 代码生成时间: 2025-08-28 21:25:30
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';

@Injectable()
export class FileDecompressorService {
  
  constructor() {}
  
  /**
   * Decompresses a zip file to a target directory.
   * @param zipFilePath the path to the zip file to decompress
   * @param targetDirectory the path to the target directory where files will be extracted
   * @returns {Promise<void>} a promise that resolves when the decompression is complete
   */
  async decompress(zipFilePath: string, targetDirectory: string): Promise<void> {
    try {
      // Check if the zip file exists
      if (!fs.existsSync(zipFilePath)) {
        throw new Error(`Zip file at ${zipFilePath} does not exist`);
      }
      
      // Ensure the target directory exists, if not, create it
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }
      
      // Create an instance of AdmZip and decompress the zip file
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(targetDirectory, /*overwrite*/true);
    } catch (error) {
      // Handle any errors that occur during decompression
      throw new Error(`An error occurred while decompressing the file: ${error.message}`);
    }
  }
}
