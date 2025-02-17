import { PartialType } from '@nestjs/swagger';
import { CreatePropuestasParticionDto } from './create-propuestas_particion.dto';

export class UpdatePropuestasParticionDto extends PartialType(CreatePropuestasParticionDto) {}
