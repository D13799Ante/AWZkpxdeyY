// 代码生成时间: 2025-08-11 06:41:51
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseMigrationTool implements TypeOrmOptionsFactory {

  // Function to create TypeOrm configuration for migrations
  createTypeOrmOptions(): TypeOrmModuleOptions {
    try {
      // Define the database connection options
      const options: TypeOrmModuleOptions = {
        type: 'postgres', // or any other database type
        host: 'localhost',
        port: 5432,
        username: 'your_username',
        password: 'your_password',
        database: 'your_database',
        entities: [
          'dist/**/*.entity{.ts,.js}',
        ],
        migrations: [
          'dist/migrations/**/*{.ts,.js}',
        ],
        cli: {
          migrationsDir: 'src/migrations',
        },
      };
      return options;
    } catch (error) {
      console.error('Error creating TypeOrm options:', error);
      throw new Error('Failed to create TypeOrm options');
    }
  }

  // Function to run database migrations
  async runMigrations(): Promise<void> {
    try {
      // Import the TypeOrm module with the migration settings
      const { default: { createConnection } } = await import('typeorm');
      const connection = await createConnection(await this.createTypeOrmOptions());
      
      // Run the migrations
      await connection.runMigrations();
      console.log('Database migrations have been executed successfully.');
    } catch (error) {
      console.error('Error running migrations:', error);
      throw new Error('Failed to run database migrations');
    }
  }
}

// Example usage:
// const migrationTool = new DatabaseMigrationTool();
// migrationTool.runMigrations();