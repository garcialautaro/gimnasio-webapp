import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@turnos/shared';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Verificar que el slug no exista
    const existingCompany = await this.companyRepository.findOne({
      where: { slug: createCompanyDto.slug },
    });

    if (existingCompany) {
      throw new ConflictException('Company slug already exists');
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      timezone: createCompanyDto.timezone || 'America/Argentina/Buenos_Aires',
      defaultQuotaDuration: createCompanyDto.defaultQuotaDuration || 30,
    });

    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async findBySlug(slug: string): Promise<Company | null> {
    return this.companyRepository.findOne({ where: { slug } });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async delete(id: string): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }
}
