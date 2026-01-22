import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const movement = await this.prisma.stockMovement.create({ data });
    await this.audit.log({ actorId, entity: "StockMovement", entityId: movement.id, action: "CREATE", after: movement });
    return movement;
  }

  async findAll(params: { skip: number; take: number }) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.stockMovement.findMany({
        skip: params.skip,
        take: params.take,
        include: { inventoryLot: true, workOrder: true, invoice: true },
      }),
      this.prisma.stockMovement.count(),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.stockMovement.findUnique({
      where: { id },
      include: { inventoryLot: true, workOrder: true, invoice: true },
    });
  }
}
