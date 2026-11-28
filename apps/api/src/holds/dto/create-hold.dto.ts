import { IsInt, IsPositive } from 'class-validator';

export class CreateHoldDto {
  @IsInt()
  @IsPositive()
  seatId: number;
}
