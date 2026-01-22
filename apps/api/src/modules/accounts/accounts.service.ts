import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async listPayable(params: { skip: number; take: number }) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.accountsPayableTitle.findMany({
        skip: params.skip,
        take: params.take,
        include: { invoice: true, payments: true, attachments: true },
      }),
      this.prisma.accountsPayableTitle.count(),
    ]);
    return { items, total };
  }

  async listReceivable(params: { skip: number; take: number }) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.accountsReceivableTitle.findMany({
        skip: params.skip,
        take: params.take,
        include: { invoice: true, payments: true, attachments: true },
      }),
      this.prisma.accountsReceivableTitle.count(),
    ]);
    return { items, total };
  }

  async createPayment(data: {
    amount: number;
    paidAt: string;
    payableTitleId?: string;
    receivableTitleId?: string;
    attachment?: { filename: string; mimeType: string; path: string; size: number };
  }, actorId?: string) {
    const payment = await this.prisma.payment.create({
      data: {
        amount: data.amount,
        paidAt: new Date(data.paidAt),
        payableTitleId: data.payableTitleId,
        receivableTitleId: data.receivableTitleId,
      },
    });

    if (data.attachment) {
      await this.prisma.attachment.create({
        data: {
          ...data.attachment,
          paymentId: payment.id,
          payableTitleId: data.payableTitleId,
          receivableTitleId: data.receivableTitleId,
        },
      });
    }

    if (data.payableTitleId) {
      await this.updateTitleStatus("payable", data.payableTitleId);
    }
    if (data.receivableTitleId) {
      await this.updateTitleStatus("receivable", data.receivableTitleId);
    }

    await this.audit.log({
      actorId,
      entity: "Payment",
      entityId: payment.id,
      action: "CREATE",
      after: payment,
    });

    return payment;
  }

  private async updateTitleStatus(type: "payable" | "receivable", titleId: string) {
    if (type === "payable") {
      const title = await this.prisma.accountsPayableTitle.findUnique({
        where: { id: titleId },
        include: { payments: true },
      });
      if (!title) return;
      const paid = title.payments.reduce((sum, item) => sum + Number(item.amount), 0);
      const status = paid >= Number(title.amount) ? "PAID" : paid > 0 ? "PARTIAL" : "OPEN";
      await this.prisma.accountsPayableTitle.update({ where: { id: titleId }, data: { status } });
    } else {
      const title = await this.prisma.accountsReceivableTitle.findUnique({
        where: { id: titleId },
        include: { payments: true },
      });
      if (!title) return;
      const paid = title.payments.reduce((sum, item) => sum + Number(item.amount), 0);
      const status = paid >= Number(title.amount) ? "PAID" : paid > 0 ? "PARTIAL" : "OPEN";
      await this.prisma.accountsReceivableTitle.update({ where: { id: titleId }, data: { status } });
    }
  }
}
