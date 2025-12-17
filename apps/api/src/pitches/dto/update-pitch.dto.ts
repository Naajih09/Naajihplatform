import { PartialType } from '@nestjs/mapped-types';
import { CreatePitchDto } from './create-pitch.dto';

export class UpdatePitchDto extends PartialType(CreatePitchDto) {}
