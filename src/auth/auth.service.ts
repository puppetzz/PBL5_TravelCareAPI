import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
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
import { Tokens } from './types/tokens.type';
import { config } from 'dotenv';
import { LoginResponse } from './types/login-response.type';
import { S3Service } from '../aws-s3/s3.service';
import { v4 as uuid } from 'uuid';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { EncryptData } from './types/encrypt-data.type';

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

  private readonly _ivlen = 16;
  private readonly _keylen = 32;

  async register(registerDto: RegisterDto) {
    const id = uuid();
    const { encryptData, salt, iv } = await this.encryptdata(
      registerDto.password,
    );

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
      passwordHash: encryptData,
      passwordSalt: salt,
      iv: iv,
    });

    const newUser = await this.userRepository.create({
      account: newAccount,
      email: registerDto.email,
      firstName: registerDto.firstName ? registerDto.firstName : null,
      lastName: registerDto.lastName ? registerDto.lastName : null,
      phoneNumber: registerDto.phoneNumber ? registerDto.phoneNumber : null,
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

    if (!account)
      throw new UnauthorizedException(
        'Username does not exist or wrong password!',
      );

    const salt = Buffer.from(account.passwordSalt, 'hex');

    const iv = Buffer.from(account.iv, 'hex');

    const decryptedPassword = await this.decryptData(
      account.passwordHash,
      loginDto.password,
      salt,
      iv,
    ).catch(() => {
      throw new UnauthorizedException(
        'Username does not exist or wrong password!',
      );
    });

    if (loginDto.password !== decryptedPassword)
      throw new UnauthorizedException(
        'Username does not exist or wrong password!',
      );

    const tokens = await this.getTokens(account.id, account.username);
    await this.updateRefreshTokenHash(account.id, tokens.refreshToken, iv);

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
        refreshTokenSalt: null,
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

    if (!account) throw new UnauthorizedException('Access denied!');

    if (!account.refreshTokenHash)
      throw new UnauthorizedException('Access denied!');

    const iv = Buffer.from(account.iv, 'hex');
    const salt = Buffer.from(account.refreshTokenSalt, 'hex');
    const decryptRefreshToken = await this.decryptData(
      account.refreshTokenHash,
      refreshToken,
      salt,
      iv,
    ).catch(() => {
      throw new UnauthorizedException('Access denied!');
    });

    if (refreshToken !== decryptRefreshToken)
      throw new UnauthorizedException('Access Denied!');

    const tokens = await this.getTokens(id, account.username);

    this.updateRefreshTokenHash(id, tokens.refreshToken, iv);

    return tokens;
  }

  async updateRefreshTokenHash(id: string, refreshToken: string, iv: Buffer) {
    const { encryptData, salt } = await this.encryptdata(refreshToken, iv);
    await this.accountRepository.update(id, {
      refreshTokenHash: encryptData,
      refreshTokenSalt: salt,
    });
  }

  private async generateKeyAndIv(
    password: string,
    salt: Buffer,
  ): Promise<{ key: Buffer; iv: Buffer }> {
    const key = (await promisify(scrypt)(
      password,
      salt,
      this._keylen,
    )) as Buffer;
    const iv = randomBytes(this._ivlen);
    return { key, iv };
  }

  private async encryptdata(
    data: string,
    iv: Buffer | null = null,
  ): Promise<EncryptData> {
    const salt = randomBytes(this._ivlen);
    const saltHex = salt.toString('hex');

    if (!iv) {
      const { key, iv } = await this.generateKeyAndIv(data, salt);
      const cipher = createCipheriv('aes-256-cbc', key, iv);
      const encryptedData =
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
      const ivHex = iv.toString('hex');
      return {
        encryptData: encryptedData,
        salt: saltHex,
        iv: ivHex,
      };
    }

    const { key } = await this.generateKeyAndIv(data, salt);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encryptedData =
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

    const ivHex = iv.toString('hex');
    return {
      encryptData: encryptedData,
      salt: saltHex,
      iv: ivHex,
    };
  }

  private async decryptData(
    encryptData: string,
    data: string,
    salt: Buffer,
    iv: Buffer,
  ): Promise<string> {
    const { key } = await this.generateKeyAndIv(data, salt);
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decryptedData =
      decipher.update(encryptData, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedData;
  }

  async getTokens(id: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          expiresIn: 60 * 60,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
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
