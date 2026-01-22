import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    actorId?: string;
    entity: string;
    entityId: string;
    action: string;
    before?: unknown;
    after?: unknown;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        entity: params.entity,
        entityId: params.entityId,
        action: params.action,
        before: params.before ?? undefined,
        after: params.after ?? undefined,
      },
    });
  }
}
