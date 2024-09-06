import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class SeaweedfsService {
  private readonly masterUrl = 'http://seaweedfs_master:9333';

  constructor(private readonly httpService: HttpService) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(`${this.masterUrl}/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }

  async getFile(fileId: string): Promise<any> {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(`${this.masterUrl}/files/${fileId}`),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to get file');
    }
  }

}
