import { Repository } from 'typeorm';
import { CompanyEntity, CreateCompanyDto, UpdateCompanyDto } from '@turnos/shared';
export declare class CompaniesService {
    private readonly companyRepository;
    constructor(companyRepository: Repository<CompanyEntity>);
    create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity>;
    findAll(): Promise<CompanyEntity[]>;
    findOne(id: string): Promise<CompanyEntity>;
    findBySlug(slug: string): Promise<CompanyEntity | null>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=companies.service.d.ts.map