import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { WorkOrderStagesController } from "./work-order-stages.controller";
import { WorkOrderStagesService } from "./work-order-stages.service";

@Module({
  imports: [AuditModule],
  controllers: [WorkOrderStagesController],
  providers: [WorkOrderStagesService],
})
export class WorkOrderStagesModule {}
