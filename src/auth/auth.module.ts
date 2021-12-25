import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserToken } from './Models/UserToken.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([UserToken]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
