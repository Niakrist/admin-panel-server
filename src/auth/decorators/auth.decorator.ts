import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OnlyAdminGuard } from '../guards/admin.guard';

export const Auth = (role: Role = Role.USER) => {
  if (role === Role.ADMIN) {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
};
