import { IsArray, IsOptional, IsString } from 'class-validator';

export class InviteWaitlistDto {
  @IsArray()
  ids: string[];

  @IsString()
  @IsOptional()
  message?: string;
}
