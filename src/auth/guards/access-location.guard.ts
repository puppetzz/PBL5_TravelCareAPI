import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocationAccess extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (!user || err || info) {
      return null;
    }

    return user;
  }
}
