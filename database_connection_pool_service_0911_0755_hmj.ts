// 代码生成时间: 2025-09-11 07:55:09
import { Injectable } from '@nestjs/common';
import { createPool, Pool, PoolConfig } from 'mysql';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

/**
 * DatabaseConnectionPoolService is responsible for managing a connection pool to the MySQL database.
 * It provides methods to safely execute queries and handle errors.
 */
@Injectable()
export class DatabaseConnectionPoolService {
  private pool: Pool;
  private logger = new Logger(DatabaseConnectionPoolService.name);

  constructor(private configService: ConfigService) {
    const dbConfig = this.configService.get<PoolConfig>('database');
    if (!dbConfig) {
      throw new Error('Database configuration is missing.');
    }
    this.pool = createPool(dbConfig);
  }

  /**
   * Execute a query on the MySQL database using the connection pool.
   * @param query The SQL query to execute.
   * @param values Optional values to be substituted into the query.
   * @returns Promise that resolves with the query results.
   */
  async executeQuery<T = any>(query: string, values?: any[]): Promise<T[]> {
    try {
      const connection = await this.pool.getConnection();
      try {
        const [results] = await connection.query(query, values);
        return results as T[];
      } finally {
        connection.release();
      }
    } catch (error) {
      this.logger.error(`Failed to execute query: ${query}`, error);
      throw error;
    }
  }

  /**
   * Close the connection pool, freeing up database resources.
   * @returns Promise that resolves when the pool is closed.
   */
  async closePool(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          this.logger.error('Failed to close the connection pool.', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
