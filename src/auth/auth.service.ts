import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Address } from '../address/entities/address.entity';
import { AddressService } from '../address/address.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { config } from 'dotenv';
import { LoginResponse } from './types/login-response.type';
import { S3Service } from '../aws-s3/s3.service';
import { v4 as uuid } from 'uuid';

config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private jwtService: JwtService,
    private readonly addressService: AddressService,
    private readonly s3Service: S3Service,
  ) {}

  async register(registerDto: RegisterDto) {
    const id = uuid();
    const hash = await this.hashData(registerDto.password);

    if (
      await this.accountRepository.findOne({
        where: { username: registerDto.username },
      })
    )
      throw new BadRequestException('Username already exists!');

    if (
      await this.userRepository.findOne({
        where: { email: registerDto.email },
      })
    )
      throw new BadRequestException('Email already registered!');

    const newAccount = await this.accountRepository.create({
      id: id,
      username: registerDto.username,
      passwordHash: hash,
    });

    const newUser = await this.userRepository.create({
      account: newAccount,
      email: registerDto.email,
      firstName: registerDto.firstName ? registerDto.firstName : null,
      lastName: registerDto.lastName ? registerDto.firstName : null,
      phoneNumber: registerDto.phoneNumber ? registerDto.firstName : null,
    });

    if (
      !!registerDto.countryId &&
      !!registerDto.provinceId &&
      !!registerDto.districtId
    ) {
      const address = await this.addressService.createAddress(
        registerDto.countryId,
        registerDto.provinceId,
        registerDto.districtId,
        registerDto.wardId,
        registerDto.streetAddress,
      );
      newUser.address = address;
    }

    await this.accountRepository.save(newAccount);
    await this.userRepository.save(newUser);

    return { message: 'Register successfully, please check your mail' };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const account = await this.accountRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (!account) throw new BadRequestException('Username does not exist!');

    const passwordMatches = await bcrypt.compareSync(
      loginDto.password,
      account.passwordHash,
    );

    if (!passwordMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(account.id, account.username);
    await this.updateRefreshTokenHash(account.id, tokens.refreshToken);

    return {
      user: {
        username: account.username,
      },
      tokens,
    };
  }

  async logout(id: string) {
    await this.accountRepository.update(
      {
        id: id,
        refreshTokenHash: Not(IsNull()),
      },
      {
        refreshTokenHash: null,
      },
    );
    return { message: 'Logged out!' };
  }

  async refreshToken(id: string, refreshToken: string) {
    const account = await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!account) throw new ForbiddenException('Access denied!');

    const refreshTokenMatches = await bcrypt.compareSync(
      refreshToken,
      account.refreshTokenHash,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied!');

    const tokens = await this.getTokens(id, account.username);
    return tokens;
  }

  async updateRefreshTokenHash(id: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.accountRepository.update({ id: id }, { refreshTokenHash: hash });
  }

  async getUser(id: string) {
    return await this.userRepository.findOne({
      where: {
        accountId: id,
      },
      relations: {
        account: true,
        address: {
          country: true,
          province: true,
          district: true,
        },
      },
      select: {
        accountId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        address: {
          streetAddress: true,
        },
        account: {
          username: true,
        },
      },
    });
  }
  hashData(data: string): string {
    return bcrypt.hash(data, 10);
  }

  async getTokens(id: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: id,
          username,
        },
        {
          expiresIn: 60 * 60,
        },
      ),
      this.jwtService.signAsync(
        {
          id: id,
          username,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
          expiresIn: 60 * 60 * 24 * 90,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
