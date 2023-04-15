import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getCurrentUser(@GetCurrentAccount('accountId') id: string): Promise<User> {
    return this.userService.getCurrentUser(id);
  }

  @Patch('update-profile-image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateProfileImage(
    @UploadedFile() image: Express.Multer.File,
    @GetCurrentAccount() user: User,
  ): Promise<string> {
    return this.userService.updateProfieImage(user, image);
  }

  @Patch('update-cover-image')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateCoverImage(
    @UploadedFile() image: Express.Multer.File,
    @GetCurrentAccount() user: User,
  ): Promise<string> {
    return this.userService.updateProfieImage(user, image);
  }

  @Patch('update-user')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: User })
  @ApiSecurity('JWT-auth')
  updateUserProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentAccount('accountId') id: string,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
