import { Controller, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from '@turnos/shared';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Company> {
    return this.companiesService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findOne(id);
  }
}
