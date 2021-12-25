import {BelongsTo, Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserToken } from 'src/auth/Models/UserToken.model';

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Table
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({
    example: '1',
    description: 'ID - auto increment',
    required: false,
  })

  @HasOne(() => UserToken, {
    as: 'token'
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({
    example: 'testuser@gmail.com',
    description: 'Email',
    required: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: 'qwaszx', description: 'Password', required: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: 'true',
    description: 'Is user banned',
    required: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned: boolean;

  @ApiProperty({
    example: 'Harassment',
    description: 'User ban reason',
    required: false,
  })
  @Column({
    type: DataType.STRING,
  })
  banReason: string;
}
