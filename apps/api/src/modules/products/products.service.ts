import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const product = await this.prisma.product.create({ data });
    await this.audit.log({ actorId, entity: "Product", entityId: product.id, action: "CREATE", after: product });
    return product;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { name: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ skip: params.skip, take: params.take, where }),
      this.prisma.product.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.product.findUnique({ where: { id } });
    const product = await this.prisma.product.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "Product", entityId: id, action: "UPDATE", before, after: product });
    return product;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.product.findUnique({ where: { id } });
    const product = await this.prisma.product.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "Product", entityId: id, action: "DELETE", before, after: null });
    return product;
  }
}
