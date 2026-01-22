import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const workOrder = await this.prisma.workOrder.create({ data });
    await this.audit.log({ actorId, entity: "WorkOrder", entityId: workOrder.id, action: "CREATE", after: workOrder });
    return workOrder;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { code: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.workOrder.findMany({ skip: params.skip, take: params.take, where, include: { contract: true } }),
      this.prisma.workOrder.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.workOrder.findUnique({ where: { id }, include: { stages: true, contract: true } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.workOrder.findUnique({ where: { id } });
    const workOrder = await this.prisma.workOrder.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "WorkOrder", entityId: id, action: "UPDATE", before, after: workOrder });
    return workOrder;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.workOrder.findUnique({ where: { id } });
    const workOrder = await this.prisma.workOrder.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "WorkOrder", entityId: id, action: "DELETE", before, after: null });
    return workOrder;
  }
}
