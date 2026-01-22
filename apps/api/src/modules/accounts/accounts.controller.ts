import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { getPagination } from "../common/pagination";
import { RequestUser } from "../common/types";
import { AccountsService } from "./accounts.service";

@ApiTags("accounts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get("payable")
  listPayable(@Query() query: { page?: number; pageSize?: number }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.accountsService.listPayable(pagination);
  }

  @Get("receivable")
  listReceivable(@Query() query: { page?: number; pageSize?: number }) {
    const pagination = getPagination(query.page, query.pageSize);
    return this.accountsService.listReceivable(pagination);
  }

  @Post("payments")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "uploads",
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createPayment(
    @Body() body: { amount: number; paidAt: string; payableTitleId?: string; receivableTitleId?: string },
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: { user: RequestUser },
  ) {
    const attachment = file
      ? {
          filename: file.originalname,
          mimeType: file.mimetype,
          path: file.path,
          size: file.size,
        }
      : undefined;
    return this.accountsService.createPayment({ ...body, attachment }, req.user.userId);
  }
}
