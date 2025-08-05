// 代码生成时间: 2025-08-05 19:46:11
import { Module } from '@nestjs/common';
import { RandomNumberGeneratorService } from './random_number_generator.service';

/**
 * RandomNumberGeneratorModule is responsible for handling the logic related to generating random numbers.
 * It includes error handling and is designed with maintainability and scalability in mind.
 */
@Module({
  providers: [RandomNumberGeneratorService],
  exports: [RandomNumberGeneratorService],
})
export class RandomNumberGeneratorModule {}

/**
 * The RandomNumberGeneratorService class provides a method to generate random numbers
 * within a specified range. It includes error handling and comments for clarity.
 */
import { Injectable } from '@nestjs/common';
import { Random } from 'crypto';

@Injectable()
export class RandomNumberGeneratorService {
  private readonly random = crypto.random;

  /**
   * Generates a random number within the specified range.
   *
   * @param min The minimum value of the range (inclusive).
   * @param max The maximum value of the range (exclusive).
   * @returns A random number within the range.
   * @throws Will throw an error if min is greater than max.
   */
  generateRandomNumber(min: number, max: number): number {
    if (min >= max) {
      throw new Error('Minimum value must be less than maximum value.');
    }

    const buffer = this.random(new Uint8Array(4));
    const randomNumber = buffer[0] + (buffer[1] << 8) + (buffer[2] << 16) + (buffer[3] << 24);
    return Math.floor(randomNumber / (0xFFFFFFFF + 1) * (max - min)) + min;
  }
}
