import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
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
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesToBodyInterceptor } from './api-file.decorator';
import { create } from 'domain';

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
}
