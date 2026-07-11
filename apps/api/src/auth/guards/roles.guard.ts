import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

const getAdminPermissionForRequest = (path = '') => {
  if (path.includes('/users/admin/team')) return 'settings';
  if (path.includes('/users/admin/stats')) return 'dashboard';
  if (path.includes('/users/admin/insights')) return 'dashboard';
  if (path.includes('/users/password')) return 'settings';
  if (path.includes('/pitches/admin')) return 'pitches';
  if (path.includes('/verification/admin')) return 'verification';
  if (path.includes('/academy/admin')) return 'academy';
  if (path.includes('/messages/admin')) return 'messages';
  if (path.includes('/audit')) return 'audit';
  if (path.includes('/users')) return 'users';
  return null;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    // 'user' object comes from JwtStrategy's validate method
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      return false;
    }

    if (user.role !== UserRole.ADMIN || !requiredRoles.includes(UserRole.ADMIN)) {
      return true;
    }

    const permission = getAdminPermissionForRequest(request.path || request.url);
    if (!permission) {
      return true;
    }

    const permissions = Array.isArray(user.adminPermissions)
      ? user.adminPermissions
      : [];

    // If the adminPermissions array is empty, deny access to mapped admin
    // areas. Admin accounts should be provisioned with explicit
    // `adminPermissions` (see UsersService.createAdmin) to grant access.
    if (permissions.length === 0) {
      return false;
    }

    return permissions.includes(permission);
  }
}
