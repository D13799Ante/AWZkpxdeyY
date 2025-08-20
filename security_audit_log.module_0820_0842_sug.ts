// 代码生成时间: 2025-08-20 08:42:04
import { Module } from '@nestjs/common';
import { SecurityAuditLogService } from './security-audit-log.service';
import { SecurityAuditLogController } from './security-audit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityAuditLogEntity } from './security-audit-log.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityAuditLogEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [SecurityAuditLogController],
  providers: [SecurityAuditLogService, JwtStrategy],
})
export class SecurityAuditLogModule {}

/* Service for handling security audit logs. */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityAuditLogEntity } from './security-audit-log.entity';
import { CreateSecurityAuditLogDto } from './dto/create-security-audit-log.dto';

@Injectable()
export class SecurityAuditLogService {
  constructor(
    @InjectRepository(SecurityAuditLogEntity)
    private securityAuditLogRepository: Repository<SecurityAuditLogEntity>,
  ) {}

  async create(createSecurityAuditLogDto: CreateSecurityAuditLogDto): Promise<SecurityAuditLogEntity> {
    try {
      const auditLog = this.securityAuditLogRepository.create(createSecurityAuditLogDto);
      return await this.securityAuditLogRepository.save(auditLog);
    } catch (error) {
      // Log the error and throw a more user-friendly message
      console.error(error);
      throw new Error('Failed to create security audit log.');
    }
  }
}

/* Controller for handling security audit log requests. */
import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { SecurityAuditLogService } from './security-audit-log.service';
import { CreateSecurityAuditLogDto } from './dto/create-security-audit-log.dto';

@Controller('security-audit-log')
export class SecurityAuditLogController {
  constructor(private readonly securityAuditLogService: SecurityAuditLogService) {}

  @Post()
  async createSecurityAuditLog(@Body() createSecurityAuditLogDto: CreateSecurityAuditLogDto): Promise<any> {
    try {
      const auditLog = await this.securityAuditLogService.create(createSecurityAuditLogDto);
      return { statusCode: HttpStatus.CREATED, auditLog };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

/* Entity representing a security audit log. */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SecurityAuditLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column()
  timestamp: Date;
}

/* DTO for creating a security audit log. */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateSecurityAuditLogDto {
  @ApiProperty({ example: 'user123', description: 'The ID of the user.' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Updated user profile', description: 'The action performed.' })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({ example: '2023-04-15T12:00:00Z', description: 'The timestamp of the action.' })
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;
}
