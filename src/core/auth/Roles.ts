import { UserRole } from '@khlug/core/auth/User';

export const ROLES_DECORATOR_KEY = Symbol('Khuthon/Roles');

export const Roles =
  (roles: UserRole[]): MethodDecorator =>
  (target, key) => {
    Reflect.defineMetadata(ROLES_DECORATOR_KEY, roles, target, key as string);
  };
