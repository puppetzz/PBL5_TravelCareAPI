import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from './location.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Location } from './entities/location.entity';
import { FilterDto } from './dto/filterDTO';
import { defaultPage, defaultLimit } from '../constant/constant';
import { CreateLocationDTO } from './dto/createLocationDTO';
import { User } from 'src/user/entities/user.entity';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FilesToBodyInterceptor } from './api-file.decorator';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { WishlistService } from 'src/wishlists/wishList.service';
import { PaginationResponse } from 'src/ultils/paginationResponse';
import { LocationAccess } from 'src/auth/guards/access-location.guard';

@Controller('locations')
@ApiTags('location')
export class LocationController {
  private logger = new Logger(LocationController.name);
  constructor(
    private locationService: LocationService,
    private wishlistService: WishlistService,
  ) {}

  @Get()
  @UseGuards(LocationAccess)
  @ApiSecurity('JWT-auth')
  getLocations(
    @GetCurrentAccount() user: User,
    @Query(ValidationPipe) filterDto: FilterDto,
  ): Promise<{ data: Location[]; pagination: PaginationResponse }> {
    const { page = defaultPage, limit = defaultLimit } = filterDto;
    return this.locationService.getLocations(user, {
      ...filterDto,
      page,
      limit,
    });
  }

  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a location' })
  @Post()
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'), FilesToBodyInterceptor)
  createLocation(
    @Body() createLocationDTO: CreateLocationDTO,
    @GetCurrentAccount() user: User,
  ): Promise<Location> {
    return this.locationService.createLocation(createLocationDTO, user);
  }
  @Patch('/:locationId')
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'), FilesToBodyInterceptor)
  updateLocation(
    @Body() updateLocationDto: UpdateLocationDto,
    @Param('locationId') locationId: string,
  ) {
    return this.locationService.updateLocation(updateLocationDto, locationId);
  }

  @Get('/:locationId')
  @UsePipes(ValidationPipe)
  @ApiSecurity('JWT-auth')
  @UseGuards(LocationAccess)
  getLocationById(
    @GetCurrentAccount() user: User,
    @Param('locationId') locationId: string,
  ) {
    return this.locationService.getLocationById(locationId, user);
  }
  @Delete('/:locationId')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a location' })
  @UsePipes(ValidationPipe)
  async deleteLocationById(
    @Param('locationId') id: string,
    @GetCurrentAccount() user: User,
  ): Promise<void> {
    if (!(await this.locationService.checkRoleAdmin(user))) {
      throw new UnauthorizedException('User not Administrator');
    }
    return this.locationService.deleteLocation(id);
  }

  @Patch('upload-location-image/:locationId')
  @ApiParam({ name: 'locationId', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: Location })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadLocationImage(
    @GetCurrentAccount() user: User,
    @Param('locationId', new ParseUUIDPipe()) locationId: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.locationService.uploadLocationimage(user, locationId, images);
  }

  @Delete('delete-location-image/:locationId/:locationImageId')
  @ApiOkResponse({ type: String })
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async deleteLocationImage(
    @GetCurrentAccount() user: User,
    @Param('locationId', new ParseUUIDPipe()) locationId: string,
    @Param('locationImageId', new ParseUUIDPipe()) locationImageId: string,
  ) {
    return this.locationService.deleteLocationImage(
      user,
      locationId,
      locationImageId,
    );
  }

  @Post('/:locationId/WishList')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create wishlist for user' })
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  async createWishList(
    @GetCurrentAccount() user: User,
    @Param('locationId') locationId: string,
  ) {
    return await this.wishlistService.createWishList(user, locationId);
  }
}
