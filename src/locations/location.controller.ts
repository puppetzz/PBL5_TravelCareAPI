import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from './location.service';
import {
  ApiConsumes,
  ApiOperation,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesToBodyInterceptor } from './api-file.decorator';
import { UpdateLocationDto } from './dto/updateLocation.dto';

@Controller('locations')
@ApiTags('location')
export class LocationController {
  private logger = new Logger(LocationController.name);
  constructor(private locationService: LocationService) {}

  @Get()
  getLocations(
    @Query(ValidationPipe) filterDto: FilterDto,
  ): Promise<Location[]> {
    const { page = defaultPage, limit = defaultLimit } = filterDto;
    return this.locationService.getLocations({ ...filterDto, page, limit });
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
  getLocationById(@Param('locationId') locationId: string) {
    return this.locationService.getLocationById(locationId);
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
}
