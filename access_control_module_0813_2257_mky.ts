// 代码生成时间: 2025-08-13 22:57:42
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// Role enum for illustrative purposes, expand with actual roles
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user is attached to the request

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Usage: Use the @Roles() decorator to protect a route with specific roles
export const Roles = (role: Role) => SetMetadata('roles', role);

// Example controller usage
// @Controller('admin')
// @UseGuards(RolesGuard)
// export class AdminController {
//   @Get()
//   @Roles(Role.ADMIN)
//   findAll() {
//     return 'Admin Route';
//   }
// }

// Custom decorator for route protection
export function Auth(...roles: Role[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('roles', roles, target, propertyKey);
  };
}

// Example usage of the custom Auth decorator
// @Controller('protected')
// export class ProtectedController {
//   @Get()
//   @Auth(Role.USER, Role.ADMIN)
//   protectedRoute() {
//     return 'Protected Route';
//   }
// }
