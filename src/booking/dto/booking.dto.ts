import { ApiProperty } from '@nestjs/swagger';
import { Rooms } from '../types/rooms.type';

export class BookingDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        roomId: {
          type: 'string',
        },
        numberOfRooms: {
          type: 'number',
        },
      },
    },
  })
  rooms: Rooms[];

  @ApiProperty({ type: Date })
  checkIn: Date;

  @ApiProperty({ type: Date })
  checkOut: Date;

  @ApiProperty()
  customerName: string;
}
