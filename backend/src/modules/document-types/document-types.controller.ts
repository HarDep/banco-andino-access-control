import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { DocumentTypeQueryDto } from './dto/query-params.dto';

@Controller('document-types')
@UseGuards(SupabaseAuthGuard)
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  findAll(@Query() query: DocumentTypeQueryDto) {
    return this.documentTypesService.findAll(query.countryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.documentTypesService.update(id, updateDocumentTypeDto);
  }

  @Patch(':id/toggle-active')
  updateCountry(@Param('id') id: string) {
    return this.documentTypesService.toggleActive(id);
  }
}
