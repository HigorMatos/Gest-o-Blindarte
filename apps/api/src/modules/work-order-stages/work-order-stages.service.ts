import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class WorkOrderStagesService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const stage = await this.prisma.workOrderStage.create({ data });
    await this.audit.log({ actorId, entity: "WorkOrderStage", entityId: stage.id, action: "CREATE", after: stage });
    return stage;
  }

  async findAll(params: { skip: number; take: number; workOrderId?: string }) {
    const where = params.workOrderId ? { workOrderId: params.workOrderId } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.workOrderStage.findMany({ skip: params.skip, take: params.take, where }),
      this.prisma.workOrderStage.count({ where }),
    ]);
    return { items, total };
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.workOrderStage.findUnique({ where: { id } });
    const stage = await this.prisma.workOrderStage.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "WorkOrderStage", entityId: id, action: "UPDATE", before, after: stage });
    return stage;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.workOrderStage.findUnique({ where: { id } });
    const stage = await this.prisma.workOrderStage.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "WorkOrderStage", entityId: id, action: "DELETE", before, after: null });
    return stage;
  }
}
