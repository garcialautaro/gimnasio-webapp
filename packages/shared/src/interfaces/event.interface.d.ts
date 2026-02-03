export interface Event {
    id: string;
    companyId: string;
    name: string;
    description?: string;
    duration: number;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
export interface CreateEventDto {
    companyId: string;
    name: string;
    description?: string;
    duration: number;
    color?: string;
}
export interface UpdateEventDto {
    name?: string;
    description?: string;
    duration?: number;
    color?: string;
    isActive?: boolean;
}
//# sourceMappingURL=event.interface.d.ts.map