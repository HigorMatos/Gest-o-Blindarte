import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const supplier = await this.prisma.supplier.create({ data });
    await this.audit.log({ actorId, entity: "Supplier", entityId: supplier.id, action: "CREATE", after: supplier });
    return supplier;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { name: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.supplier.findMany({ skip: params.skip, take: params.take, where }),
      this.prisma.supplier.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.supplier.findUnique({ where: { id } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.supplier.findUnique({ where: { id } });
    const supplier = await this.prisma.supplier.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "Supplier", entityId: id, action: "UPDATE", before, after: supplier });
    return supplier;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.supplier.findUnique({ where: { id } });
    const supplier = await this.prisma.supplier.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "Supplier", entityId: id, action: "DELETE", before, after: null });
    return supplier;
  }
}
