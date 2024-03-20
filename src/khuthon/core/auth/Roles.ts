import { SetMetadata } from '@nestjs/common';

import { UserRole } from '@khlug/khuthon/core/auth/User';

export const ROLES_DECORATOR_KEY = Symbol('Khuthon/Roles');

export const Roles = (roles: UserRole[]) =>
  SetMetadata(ROLES_DECORATOR_KEY, roles);
