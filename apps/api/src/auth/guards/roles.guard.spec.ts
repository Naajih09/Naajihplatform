import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';

describe('RolesGuard admin permissions', () => {
  const createGuard = (requiredRoles: UserRole[] = [UserRole.ADMIN]) => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    } as unknown as Reflector;

    return new RolesGuard(reflector);
  };

  const createContext = (user: any, path: string) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user, path }),
      }),
    }) as unknown as ExecutionContext;

  it('allows legacy admins with empty permissions to view the dashboard', () => {
    const guard = createGuard();
    const context = createContext(
      {
        role: UserRole.ADMIN,
        adminPermissions: [],
      },
      '/api/users/admin/dashboard',
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('enforces explicit admin permissions when they are present', () => {
    const guard = createGuard();
    const context = createContext(
      {
        role: UserRole.ADMIN,
        adminPermissions: ['settings'],
      },
      '/api/users/admin/dashboard',
    );

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows admins with the matching explicit permission', () => {
    const guard = createGuard();
    const context = createContext(
      {
        role: UserRole.ADMIN,
        adminPermissions: ['dashboard'],
      },
      '/api/users/admin/dashboard',
    );

    expect(guard.canActivate(context)).toBe(true);
  });
});
