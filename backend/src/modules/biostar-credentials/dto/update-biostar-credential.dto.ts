import { PartialType } from '@nestjs/mapped-types';
import { CreateBiostarCredentialDto } from './create-biostar-credential.dto';

export class UpdateBiostarCredentialDto extends PartialType(CreateBiostarCredentialDto) {}
