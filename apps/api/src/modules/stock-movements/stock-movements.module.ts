import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { StockMovementsController } from "./stock-movements.controller";
import { StockMovementsService } from "./stock-movements.service";

@Module({
  imports: [AuditModule],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
})
export class StockMovementsModule {}
