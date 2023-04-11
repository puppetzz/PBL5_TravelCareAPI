import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getCurrentUser(@GetCurrentAccount('id') id: string) {
    return this.userService.getCurrentUser(id);
  }
}
