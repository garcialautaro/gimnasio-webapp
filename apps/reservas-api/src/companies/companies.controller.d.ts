import { CompaniesService } from './companies.service';
import { Company } from '@turnos/shared';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findBySlug(slug: string): Promise<Company>;
    findOne(id: string): Promise<Company>;
}
//# sourceMappingURL=companies.controller.d.ts.map