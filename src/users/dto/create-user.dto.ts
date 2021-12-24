import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'testuser@gmail.com',
    description: 'Email',
    required: true,
  })
  readonly email: string;

  @ApiProperty({ example: 'qwaszx', description: 'Password', required: true })
  readonly password: string;
}
