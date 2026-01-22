import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { StockMovementsService } from "./stock-movements.service";

@ApiTags("stock-movements")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("stock-movements")
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  create(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.stockMovementsService.create(body, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { page?: number; pageSize?: number }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.stockMovementsService.findAll(pagination);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stockMovementsService.findOne(id);
  }
}
