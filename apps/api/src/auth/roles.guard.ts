import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@flames/database';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: UserRole[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !this.allowedRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}

export function AdminRolesGuard() {
  return new RolesGuard([UserRole.admin, UserRole.kitchen]);
}
