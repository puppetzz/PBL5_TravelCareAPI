import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Request } from 'express';
import { Tokens } from './types/tokens.type';
import { GetCurrentAccount } from './decorators/get-current-account.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: Object })
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @Post('/logout')
  @ApiOkResponse()
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const payload = req.user;
    return this.authService.logout(payload['sub']);
  }

  @Post('/refresh')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiSecurity('JWT-auth')
  refreshToken(
    @GetCurrentAccount('sub') id: string,
    @GetCurrentAccount('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(id, refreshToken);
  }

  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: User })
  @Get('/user/:id')
  @UseGuards(AccessTokenGuard)
  getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}
