// 代码生成时间: 2025-09-05 15:54:31
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * HashCalculatorService class
 * Provides methods to calculate hash values.
 *
 * @class HashCalculatorService
 */
@Injectable()
export class HashCalculatorService {
  
  /**
   * Calculate SHA-256 hash of a given string.
   *
   * @param {string} data - The string to be hashed.
   * @returns {Promise<string>} - The SHA-256 hash of the input string.
   * @throws {Error} - If the input is not a string.
   */
  async calculateSha256Hash(data: string): Promise<string> {
    if (typeof data !== 'string') {
      throw new Error('Input must be a string.');
    }
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(64, (err, buffer) => {
        if (err) {
          reject(err);
        }
        const hash = crypto.createHash('sha256').update(buffer.toString('utf8')).digest('hex');
        resolve(hash);
      });
    });
  }

  /**
   * Calculate SHA-512 hash of a given string.
   *
   * @param {string} data - The string to be hashed.
   * @returns {Promise<string>} - The SHA-512 hash of the input string.
   * @throws {Error} - If the input is not a string.
   */
  async calculateSha512Hash(data: string): Promise<string> {
    if (typeof data !== 'string') {
      throw new Error('Input must be a string.');
    }
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(64, (err, buffer) => {
        if (err) {
          reject(err);
        }
        const hash = crypto.createHash('sha512').update(buffer.toString('utf8')).digest('hex');
        resolve(hash);
      });
    });
  }

  /**
   * Calculate MD5 hash of a given string.
   *
   * @param {string} data - The string to be hashed.
   * @returns {Promise<string>} - The MD5 hash of the input string.
   * @throws {Error} - If the input is not a string.
   */
  async calculateMd5Hash(data: string): Promise<string> {
    if (typeof data !== 'string') {
      throw new Error('Input must be a string.');
    }
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(64, (err, buffer) => {
        if (err) {
          reject(err);
        }
        const hash = crypto.createHash('md5').update(buffer.toString('utf8')).digest('hex');
        resolve(hash);
      });
    });
  }

  /**
   * Calculate HMAC SHA-256 hash of a given string.
   *
   * @param {string} data - The string to be hashed.
   * @param {string} secret - The secret key for HMAC.
   * @returns {Promise<string>} - The HMAC SHA-256 hash of the input string.
   * @throws {Error} - If the input is not a string or if the secret is not provided.
   */
  async calculateHmacSha256(data: string, secret: string): Promise<string> {
    if (typeof data !== 'string' || typeof secret !== 'string') {
      throw new Error('Input and secret must be strings.');
    }
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(64, (err, buffer) => {
        if (err) {
          reject(err);
        }
        const hmac = crypto.createHmac('sha256', secret).update(buffer.toString('utf8')).digest('hex');
        resolve(hmac);
      });
    });
  }
}
