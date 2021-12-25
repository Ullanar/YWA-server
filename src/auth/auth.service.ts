import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { UserToken } from './Models/UserToken.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const userToken = await UserToken.findOne({ where: { userId: user.id } });
    if (userToken) {
      await userToken.update({ token: refreshToken });
    } else {
      await UserToken.create({
        userId: user.id,
        token: refreshToken,
      });
    }
    return { user, accessToken, refreshToken };
  }

  async logout(req) {
    try {
      const user = await this.userService.getUserById(req.body.id);
      const userToken = await UserToken.findOne({ where: { userId: user.id } });
      await userToken.destroy();
      return true;
    } catch (e) {
      throw new HttpException(
        'Ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return 'User was created';
  }

  async refresh(req) {
    if (!req.cookies?.refreshToken) {
      throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED);
    }
    if (!(await this.validateToken(req.cookies.refreshToken))) {
      throw new HttpException('Срок сессии истек', HttpStatus.UNAUTHORIZED);
    }
    const decodedUserToken = this.jwtService.decode(req.cookies.refreshToken);
    const userDBToken = await UserToken.findOne({
      where: { userId: decodedUserToken['id'] },
    });
    if (!userDBToken) {
      throw new HttpException(
        'Отсутствует запись сессии',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const decodedDBToken = this.jwtService.decode(userDBToken.token);
    if (decodedDBToken['id'] !== decodedUserToken['id']) {
      throw new HttpException('Ошибка сессии', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.getUserById(decodedUserToken['id']);
    const accessToken = await this.generateAccessToken(user);

    if (!user || !accessToken) {
      throw new HttpException(
        'Ошибка обновления сессии',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { user, accessToken };
  }

  async validateToken(token) {
    return this.jwtService.verify(token);
  }

  private async generateAccessToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '24h',
    });
  }

  private async generateRefreshToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '1440h',
    });
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл или пароль',
    });
  }
}
