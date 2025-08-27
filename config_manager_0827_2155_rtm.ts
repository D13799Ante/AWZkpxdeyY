// 代码生成时间: 2025-08-27 21:55:45
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

/**
 * Configuration management error class.
 */
class ConfigManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigManagerError';
  }
}

/**
 * The Configuration Manager Service class.
 * Manages reading and writing application configuration files.
 */
@Injectable()
export class ConfigManagerService {
  private configPath: string;

  constructor(private configService: ConfigService) {
    // Define the configuration file path based on the environment variable or default.
    this.configPath = this.configService.get<string>('CONFIG_FILE_PATH') || 'config.json';
  }

  /**
   * Reads the configuration file.
   * @returns The configuration object.
   */
  async readConfig(): Promise<Record<string, any>> {
    if (!existsSync(this.configPath)) {
      throw new ConfigManagerError(`Configuration file not found at path: ${this.configPath}`);
    }

    try {
      const data = readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new ConfigManagerError('Failed to read configuration file.');
    }
  }

  /**
   * Writes to the configuration file.
   * @param config The configuration object to write.
   */
  async writeConfig(config: Record<string, any>): Promise<void> {
    try {
      const data = JSON.stringify(config, null, 2);
      writeFileSync(this.configPath, data);
    } catch (error) {
      throw new ConfigManagerError('Failed to write configuration file.');
    }
  }
}
