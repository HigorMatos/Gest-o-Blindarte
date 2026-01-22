import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { RolesGuard } from "./auth/roles.guard";
import { AuditModule } from "./audit/audit.module";
import { AccountsModule } from "./accounts/accounts.module";
import { ClientsModule } from "./clients/clients.module";
import { ContractsModule } from "./contracts/contracts.module";
import { InventoryModule } from "./inventory/inventory.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { StockMovementsModule } from "./stock-movements/stock-movements.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { VehiclesModule } from "./vehicles/vehicles.module";
import { WorkOrdersModule } from "./work-orders/work-orders.module";
import { WorkOrderStagesModule } from "./work-order-stages/work-order-stages.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditModule,
    AccountsModule,
    ClientsModule,
    VehiclesModule,
    SuppliersModule,
    ProductsModule,
    InventoryModule,
    StockMovementsModule,
    ContractsModule,
    WorkOrdersModule,
    WorkOrderStagesModule,
    InvoicesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
