import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Response() res) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      userDto,
    );
    console.log(user);
    console.log(accessToken);
    console.log(refreshToken);
    return res
      .cookie('refreshToken', refreshToken, {
        expires: new Date(),
        sameSite: 'strict',
        httpOnly: true,
      })
      .json({ user, accessToken });
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
