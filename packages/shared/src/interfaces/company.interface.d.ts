export interface Company {
    id: string;
    slug: string;
    name: string;
    description?: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    timezone: string;
    defaultQuotaDuration: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
export interface CreateCompanyDto {
    slug: string;
    name: string;
    email: string;
    description?: string;
    phone?: string;
    address?: string;
    timezone?: string;
    defaultQuotaDuration?: number;
}
export interface UpdateCompanyDto {
    name?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    timezone?: string;
    defaultQuotaDuration?: number;
    isActive?: boolean;
}
//# sourceMappingURL=company.interface.d.ts.map