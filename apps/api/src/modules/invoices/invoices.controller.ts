import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { InvoicesService } from "./invoices.service";

@ApiTags("invoices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post("purchase")
  createPurchase(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.invoicesService.createPurchase(body, req.user.userId);
  }

  @Post("sales")
  createSales(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.invoicesService.createSales(body, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { page?: number; pageSize?: number; type?: string }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.invoicesService.findAll({ ...pagination, type: query.type });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.invoicesService.findOne(id);
  }
}
