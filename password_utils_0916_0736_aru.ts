// 代码生成时间: 2025-09-16 07:36:54
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * PasswordUtils class provides functionalities for hashing and verifying passwords.
 * It uses bcrypt library for secure password hashing.
 */
@Injectable()
export class PasswordUtils {
  
  /**
   * Hashes a password using bcrypt.
   * @param password The plain text password to be hashed.
   * @returns The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10); // 10 is the salt rounds
    } catch (error) {
      throw new Error('Failed to hash password: ' + error.message);
    }
  }

  /**
   * Verifies a password against a hashed password.
   * @param password The plain text password to verify.
   * @param hashedPassword The previously hashed password.
   * @returns A boolean indicating whether the password matches the hash.
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Failed to verify password: ' + error.message);
    }
  }
}
