import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';

@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldService: CustomFieldsService) {}

  @Post()
  createField(@Body() fieldDto: Record<string, any>) {
    return this.customFieldService.CreateField(fieldDto.fieldName, fieldDto.fieldType, fieldDto.fieldFor);
  }

  @Get()
  getFields(@Body() fieldDto: Record<string, any>) {
    return this.customFieldService.getAll(fieldDto.fieldFor);
  }

  @Get('used')
  getSome(@Body() fieldDto: Record<string, any>) {
    return this.customFieldService.getSome(fieldDto.fields)
  }

}
