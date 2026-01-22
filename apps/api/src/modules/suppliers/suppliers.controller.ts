import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { SuppliersService } from "./suppliers.service";

@ApiTags("suppliers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("suppliers")
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() body: any, @Req() req: { user: RequestUser }) {
    return this.suppliersService.create(body, req.user.userId);
  }

  @Get()
  findAll(@Query() query: { page?: number; pageSize?: number; search?: string }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.suppliersService.findAll({ ...pagination, search: query.search });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.suppliersService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any, @Req() req: { user: RequestUser }) {
    return this.suppliersService.update(id, body, req.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: { user: RequestUser }) {
    return this.suppliersService.remove(id, req.user.userId);
  }
}
