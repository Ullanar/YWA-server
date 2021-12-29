import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    example: 'yJhbGciOiJIU.zI1NiIsInR5cCI6.IkpXVCJ9.eyJ',
    description: 'JWT',
    required: true,
  })
  readonly token: string;

  @ApiProperty({ example: '13', description: 'User ID', required: true })
  readonly userId: string;
}
