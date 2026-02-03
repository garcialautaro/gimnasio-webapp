import { Repository } from 'typeorm';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@turnos/shared';
export declare class CompaniesService {
    private readonly companyRepository;
    constructor(companyRepository: Repository<Company>);
    create(createCompanyDto: CreateCompanyDto): Promise<Company>;
    findAll(): Promise<Company[]>;
    findOne(id: string): Promise<Company>;
    findBySlug(slug: string): Promise<Company | null>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=companies.service.d.ts.map