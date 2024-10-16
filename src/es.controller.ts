import {Controller, Get, Post, Query} from '@nestjs/common';
import { EsService } from './es.service';

@Controller()
export class EsController {
  constructor(private readonly esService: EsService) {}

  @Get()
  async findESDocuments(
      @Query('userId') userId: string,
      @Query('businessType') businessType: string,
  ) {
    return await this.esService.findDocuments(
        userId,
        businessType,
    );
  }

  @Post()
  async createESDocuments() {
    await this.esService.createDocuments();

    return true;
  }
}
