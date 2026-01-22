import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(data: any, actorId?: string) {
    const vehicle = await this.prisma.vehicle.create({ data });
    await this.audit.log({ actorId, entity: "Vehicle", entityId: vehicle.id, action: "CREATE", after: vehicle });
    return vehicle;
  }

  async findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? { plate: { contains: params.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({ skip: params.skip, take: params.take, where }),
      this.prisma.vehicle.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: string, data: any, actorId?: string) {
    const before = await this.prisma.vehicle.findUnique({ where: { id } });
    const vehicle = await this.prisma.vehicle.update({ where: { id }, data });
    await this.audit.log({ actorId, entity: "Vehicle", entityId: id, action: "UPDATE", before, after: vehicle });
    return vehicle;
  }

  async remove(id: string, actorId?: string) {
    const before = await this.prisma.vehicle.findUnique({ where: { id } });
    const vehicle = await this.prisma.vehicle.delete({ where: { id } });
    await this.audit.log({ actorId, entity: "Vehicle", entityId: id, action: "DELETE", before, after: null });
    return vehicle;
  }
}
