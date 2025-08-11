// 代码生成时间: 2025-08-11 20:00:19
import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLog } from './audit-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogRepository } from './audit-log.repository';

/**
 * Security Audit Log Module
 * This module is responsible for handling security audit logs.
 * It provides a service to create and manage audit logs.
 * It also provides a controller to interact with the audit logs.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, AuditLogRepository]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class SecurityAuditLogModule {}

/* Audit Log Service */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogRepository } from './audit-log.repository';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogRepository)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create a new audit log entry.
   * @param logData The data to be logged.
   * @returns The created audit log entry.
   */
  async createLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    try {
      return await this.auditLogRepository.save(logData);
    } catch (error) {
      throw new Error('Failed to create audit log: ' + error.message);
    }
  }
}

/* Audit Log Controller */
import { Controller, Post, Body } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.entity';

/**
 * Audit Log Controller
 * This controller handles HTTP requests related to audit logs.
 */
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Create a new audit log.
   * @param logData The data to be logged.
   * @returns The created audit log entry.
   */
  @Post()
  async create(@Body() logData: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogService.createLog(logData);
  }
}

/* Audit Log Entity */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Audit Log Entity
 * Represents an audit log entry.
 */
@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  action: string;

  @Column()
  description: string;

  @Column()
  timestamp: Date;
}

/* Audit Log Repository */
import { Repository, EntityRepository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@EntityRepository(AuditLog)
export class AuditLogRepository extends Repository<AuditLog> {
  // Custom repository methods can be added here.
}