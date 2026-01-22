import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { WorkOrderStagesService } from "./work-order-stages.service";

@ApiTags("work-order-stages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("work-order-stages")
export class WorkOrderStagesController {
  constructor(private readonly workOrderStagesService: WorkOrderStagesService) {}

  @Post()
  create(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.workOrderStagesService.create(body, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { page?: number; pageSize?: number; workOrderId?: string }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.workOrderStagesService.findAll({ ...pagination, workOrderId: query.workOrderId });
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any, @Req() req: { user: RequestUser }) {
    return this.workOrderStagesService.update(id, body, req.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: { user: RequestUser }) {
    return this.workOrderStagesService.remove(id, req.user.userId);
  }
}
