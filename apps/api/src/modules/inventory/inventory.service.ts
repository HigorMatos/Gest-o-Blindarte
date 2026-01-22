import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const lot = await this.prisma.inventoryLot.create({ data });
    await this.audit.log({ actorId, entity: "InventoryLot", entityId: lot.id, action: "CREATE", after: lot });
    return lot;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { batch: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.inventoryLot.findMany({ skip: params.skip, take: params.take, where, include: { product: true } }),
      this.prisma.inventoryLot.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.inventoryLot.findUnique({ where: { id }, include: { product: true } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.inventoryLot.findUnique({ where: { id } });
    const lot = await this.prisma.inventoryLot.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "InventoryLot", entityId: id, action: "UPDATE", before, after: lot });
    return lot;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.inventoryLot.findUnique({ where: { id } });
    const lot = await this.prisma.inventoryLot.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "InventoryLot", entityId: id, action: "DELETE", before, after: null });
    return lot;
  }
}
