// 代码生成时间: 2025-09-02 15:24:57
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Injectable()
export class ImageResizerService {
  private readonly outputDirectory: string = 'resized-images';

  constructor() {
    // Create the output directory if it does not exist
    if (!existsSync(this.outputDirectory)) {
      mkdirSync(this.outputDirectory, { recursive: true });
    }
  }

  /**
   * Resizes a batch of images to the specified width and height.
   * @param imagePaths Array of file paths to the images that need resizing.
   * @param width The desired width for the resized images.
   * @param height The desired height for the resized images.
   * @returns A promise that resolves with the resized image file paths.
   */
  async resizeImages(imagePaths: string[], width: number, height: number): Promise<string[]> {
    try {
      const resizedPaths: string[] = [];

      for (const path of imagePaths) {
        if (!existsSync(path)) {
          throw new Error(`The file at path ${path} does not exist.`);
        }

        const outputPath = join(this.outputDirectory, path.replace(/\.jpg$/, '_resized.jpg'));
        await sharp(path)
          .resize({ width, height })
          .toFile(outputPath);

        resizedPaths.push(outputPath);
      }

      return resizedPaths;
    } catch (error) {
      throw new Error(`An error occurred while resizing images: ${error.message}`);
    }
  }
}
