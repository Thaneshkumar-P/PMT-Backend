import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomField, CustomFieldDocument } from './custom-fields.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectModel(CustomField.name) private customFieldModel: Model<CustomFieldDocument>
  ) {}

  async CreateField(
    fieldname: string,
    fieldType: string,
    fieldFor: string
  ) {
    const field = new this.customFieldModel({
      fieldName: fieldname,
      type: fieldType,
      fieldFor: fieldFor
    })

    return field.save()
  }

  async getAll(fieldFor: string) {
    return this.customFieldModel.find({ fieldFor }).exec();
  }

  async getSome(fieldName: string[]){
    return this.customFieldModel.find({ fieldName }).exec();
  }
}
