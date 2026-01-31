import { CompaniesService } from './companies.service';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@turnos/shared';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto): Promise<Company>;
    findAll(): Promise<Company[]>;
    findBySlug(slug: string): Promise<Company>;
    findOne(id: string): Promise<Company>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=companies.controller.d.ts.map