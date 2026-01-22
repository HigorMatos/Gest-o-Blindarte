import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { ContractsService } from "./contracts.service";

@ApiTags("contracts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.contractsService.create(body, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { page?: number; pageSize?: number; search?: string }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.contractsService.findAll({ ...pagination, search: query.search });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contractsService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any, @Req() req: { user: RequestUser }) {
    return this.contractsService.update(id, body, req.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: { user: RequestUser }) {
    return this.contractsService.remove(id, req.user.userId);
  }
}
