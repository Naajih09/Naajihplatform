import { PartialType } from '@nestjs/swagger';
import { CreateAcedemyDto } from './create-acedemy.dto';

export class UpdateAcedemyDto extends PartialType(CreateAcedemyDto) {}
