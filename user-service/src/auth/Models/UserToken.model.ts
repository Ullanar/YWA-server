import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.model';

@Table
export class UserToken extends Model {
  @ApiProperty({
    example: '11',
    description: 'User ID',
    required: true,
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs.eyJlbWFpbCLl6uJgm.uqURdEJRQ',
    description: 'JWT Token',
    required: true,
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token: string;
}
