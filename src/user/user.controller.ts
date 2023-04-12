import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './dto/user-response.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from './entities/user.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  getCurrentUser(@GetCurrentAccount('id') id: string): Promise<User> {
    return this.userService.getCurrentUser(id);
  }
}
