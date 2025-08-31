// 代码生成时间: 2025-09-01 04:23:59
// user_permission_management.ts
import { Module, forwardRef, Inject, Optional, HttpModule } from '@nestjs/common';
# 扩展功能模块
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { RolesGuard } from './roles.guard';

/**
 * UserPermissionModule handles user permissions and authorization.
 */
@Module({
# TODO: 优化性能
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([UserEntity, UserPermissionEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [UserPermissionController],
  providers: [
    AuthService,
    { provide: 'USER_PERMISSION_SERVICE', useClass: UserPermissionService },
    JwtStrategy,
    RolesGuard,
  ],
  exports: ['USER_PERMISSION_SERVICE'],
})
export class UserPermissionModule {}
# 增强安全性

/**
 * UserPermissionService provides business logic for user permissions.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermissionEntity } from './entities/user-permission.entity';

@Injectable()
export class UserPermissionService {
  constructor(
# TODO: 优化性能
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
  ) {}

  /**
   * Check if a user has a specific permission.
   * @param userId The ID of the user to check.
# TODO: 优化性能
   * @param permission The permission to check.
   * @returns A boolean indicating whether the user has the permission.
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const userPermissions = await this.userPermissionRepository.find({ where: { userId } });
# 添加错误处理
    return userPermissions.some(p => p.permission === permission);
  }
# TODO: 优化性能
}
# 添加错误处理

/**
 * UserPermissionController handles incoming HTTP requests related to user permissions.
 */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
# 添加错误处理
import { Roles } from './roles.decorator';
import { UserPermissionService } from './user-permission.service';

@Controller('user-permissions')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  /**
   * Check if the current user has a specific permission.
   * @param req The HTTP request object.
   * @returns A boolean indicating whether the user has the permission.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('check')
  @Roles('admin') // restrict this endpoint to admin users
  async checkPermission(@Req() req: Request): Promise<boolean> {
    const userId = req.user.id;
    const permission = req.query.permission;
    if (!permission) {
      throw new Error('Permission query parameter is required.');
    }
    return await this.userPermissionService.hasPermission(userId, permission);
  }
}
# 扩展功能模块
