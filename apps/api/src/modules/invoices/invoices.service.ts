import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async createPurchase(data: {
    number: string;
    issueDate: string;
    supplierId?: string;
    dueDate: string;
    items: { productId: string; quantity: number; unitPrice: string; lot?: { serial?: string; batch?: string; quantity: number; location?: string } }[];
  }, actorId?: string) {
    const invoice = await this.prisma.invoice.create({
      data: {
        type: "PURCHASE",
        number: data.number,
        issueDate: new Date(data.issueDate),
        supplierId: data.supplierId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
        accountsPayableTitle: {
          create: {
            amount: data.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0),
            dueDate: new Date(data.dueDate),
            status: "OPEN",
          },
        },
      },
      include: { items: true, accountsPayableTitle: true },
    });

    for (const item of data.items) {
      const lot = await this.prisma.inventoryLot.create({
        data: {
          productId: item.productId,
          serial: item.lot?.serial,
          batch: item.lot?.batch,
          quantity: item.lot?.quantity ?? item.quantity,
          location: item.lot?.location,
        },
      });
      await this.prisma.stockMovement.create({
        data: {
          type: "IN",
          quantity: item.quantity,
          inventoryLotId: lot.id,
          invoiceId: invoice.id,
        },
      });
    }

    await this.audit.log({
      actorId,
      entity: "Invoice",
      entityId: invoice.id,
      action: "CREATE_PURCHASE",
      after: invoice,
    });

    return invoice;
  }

  async createSales(data: {
    number: string;
    issueDate: string;
    contractId?: string;
    workOrderId?: string;
    dueDate: string;
    items: { productId: string; quantity: number; unitPrice: string }[];
  }, actorId?: string) {
    const invoice = await this.prisma.invoice.create({
      data: {
        type: "SALES",
        number: data.number,
        issueDate: new Date(data.issueDate),
        contractId: data.contractId,
        workOrderId: data.workOrderId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
        accountsReceivableTitle: {
          create: {
            amount: data.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0),
            dueDate: new Date(data.dueDate),
            status: "OPEN",
          },
        },
      },
      include: { items: true, accountsReceivableTitle: true },
    });

    await this.audit.log({
      actorId,
      entity: "Invoice",
      entityId: invoice.id,
      action: "CREATE_SALES",
      after: invoice,
    });

    return invoice;
  }

  async findAll(params: { skip: number; take: number; type?: string }) {
    const where = params.type ? { type: params.type as any } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        skip: params.skip,
        take: params.take,
        where,
        include: { supplier: true, contract: true, workOrder: true, items: true },
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        supplier: true,
        contract: true,
        workOrder: true,
        accountsPayableTitle: true,
        accountsReceivableTitle: true,
      },
    });
  }
}
