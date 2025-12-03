import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { getFirestore } from '@turnos/firebase-config';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@turnos/shared';

@Injectable()
export class CompaniesService {
  private readonly collection = 'companies';

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const db = getFirestore();

    // Verificar que el slug no exista
    const existingCompany = await this.findBySlug(createCompanyDto.slug);
    if (existingCompany) {
      throw new ConflictException('Company slug already exists');
    }

    const docRef = db.collection(this.collection).doc();

    const company: Company = {
      id: docRef.id,
      slug: createCompanyDto.slug,
      name: createCompanyDto.name,
      email: createCompanyDto.email,
      description: createCompanyDto.description,
      phone: createCompanyDto.phone,
      address: createCompanyDto.address,
      timezone: createCompanyDto.timezone || 'America/Argentina/Buenos_Aires',
      defaultQuotaDuration: createCompanyDto.defaultQuotaDuration || 30,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    await docRef.set(company);
    return company;
  }

  async findAll(): Promise<Company[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map((doc) => doc.data() as Company);
  }

  async findOne(id: string): Promise<Company> {
    const db = getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return doc.data() as Company;
  }

  async findBySlug(slug: string): Promise<Company | null> {
    const db = getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as Company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const db = getFirestore();
    const docRef = db.collection(this.collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    const updatedCompany = {
      ...doc.data(),
      ...updateCompanyDto,
      updatedAt: new Date(),
    };

    await docRef.update(updatedCompany);
    return updatedCompany as Company;
  }

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
