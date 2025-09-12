// 代码生成时间: 2025-09-13 07:16:42
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RoleService } from './role.service';
# 优化算法效率
import { PermissionService } from './permission.service';
# 优化算法效率

/**
 * UserPermissionModule provides services and controllers for managing user permissions.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    forwardRef(() => UserModule),
  ],
  providers: [UserPermissionService, AuthService, JwtStrategy, RoleService, PermissionService],
  controllers: [UserPermissionController],
  exports: [UserPermissionService, RoleService, PermissionService],
})
export class UserPermissionModule {}

/**
# 扩展功能模块
 * UserPermissionService handles business logic for user permissions.
 */
import { Injectable } from '@nestjs/common';
# 优化算法效率
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
# 增强安全性
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
    private jwtService: JwtService,
  ) {}

  /**
   * Assign a role to a user.
   * @param userId The ID of the user.
   * @param roleId The ID of the role.
   * @returns The user with the assigned role.
   */
# 优化算法效率
  async assignRole(userId: number, roleId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const userRole = plainToInstance(UserRole, { user, role: { id: roleId } });
# 扩展功能模块
    await this.userRoleRepository.save(userRole);
    return user;
  }

  /**
   * Remove a role from a user.
   * @param userId The ID of the user.
   * @param roleId The ID of the role.
# 改进用户体验
   * @returns The user with the role removed.
   */
  async removeRole(userId: number, roleId: number): Promise<User> {
    const userRole = await this.userRoleRepository.findOne({ where: { userId } });
    if (!userRole) {
      throw new Error('User role not found');
    }
    await this.userRoleRepository.remove(userRole);
    return user;
  }
}

/**
 * UserPermissionController handles HTTP requests related to user permissions.
 */
import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
# 改进用户体验
import { RoleDto } from './dtos/role.dto';

@Controller('user-permissions')
export class UserPermissionController {
  constructor(private userPermissionService: UserPermissionService) {}

  /**
   * Assign a role to a user.
   * @param userId The ID of the user.
   * @param roleDto The role data to assign.
   * @returns The user with the assigned role.
   */
  @Post(':userId/roles')
  async assignRole(@Param('userId') userId: number, @Body() roleDto: RoleDto): Promise<any> {
    try {
      return await this.userPermissionService.assignRole(userId, roleDto.roleId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

/**
# 优化算法效率
 * DTO for assigning a role to a user.
 */
export class RoleDto {
  roleId: number;
}
