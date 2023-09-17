//this us auth.guard.ts. Please create AuthGuard in nestjs for my use so that I can use @Roles for UserType

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    const { authorization } = headers;
    if (!authorization) {
      return false;
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.prismaService.user.findUnique({
        where: { id: decodedToken.userId },
      });
      if (!user) return false;
      if (!roles.includes(user.userType)) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
}
