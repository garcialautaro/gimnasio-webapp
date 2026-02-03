"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CompaniesService = class CompaniesService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async create(createCompanyDto) {
        const existingCompany = await this.companyRepository.findOne({
            where: { slug: createCompanyDto.slug },
        });
        if (existingCompany) {
            throw new common_1.ConflictException('Company slug already exists');
        }
        const company = this.companyRepository.create({
            ...createCompanyDto,
            timezone: createCompanyDto.timezone || 'America/Argentina/Buenos_Aires',
            defaultQuotaDuration: createCompanyDto.defaultQuotaDuration || 30,
        });
        return this.companyRepository.save(company);
    }
    async findAll() {
        return this.companyRepository.find();
    }
    async findOne(id) {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }
    async findBySlug(slug) {
        return this.companyRepository.findOne({ where: { slug } });
    }
    async update(id, updateCompanyDto) {
        const company = await this.findOne(id);
        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }
    async delete(id) {
        const result = await this.companyRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        }
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shared_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map