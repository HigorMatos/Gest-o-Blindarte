import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const contract = await this.prisma.contract.create({ data });
    await this.audit.log({ actorId, entity: "Contract", entityId: contract.id, action: "CREATE", after: contract });
    return contract;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { code: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contract.findMany({ skip: params.skip, take: params.take, where, include: { client: true } }),
      this.prisma.contract.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.contract.findUnique({ where: { id }, include: { client: true, workOrders: true } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.contract.findUnique({ where: { id } });
    const contract = await this.prisma.contract.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "Contract", entityId: id, action: "UPDATE", before, after: contract });
    return contract;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.contract.findUnique({ where: { id } });
    const contract = await this.prisma.contract.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "Contract", entityId: id, action: "DELETE", before, after: null });
    return contract;
  }
}
