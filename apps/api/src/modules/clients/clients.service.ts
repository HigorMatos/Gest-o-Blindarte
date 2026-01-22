import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const client = await this.prisma.client.create({ data });
    await this.audit.log({ actorId, entity: "Client", entityId: client.id, action: "CREATE", after: client });
    return client;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { name: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({ skip: params.skip, take: params.take, where }),
      this.prisma.client.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({ where: { id } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.client.findUnique({ where: { id } });
    const client = await this.prisma.client.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "Client", entityId: id, action: "UPDATE", before, after: client });
    return client;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.client.findUnique({ where: { id } });
    const client = await this.prisma.client.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "Client", entityId: id, action: "DELETE", before, after: null });
    return client;
  }
}
