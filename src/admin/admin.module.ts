import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminAuthService,  AdminJobsService ,AdminReportsService,AdminReviewsService } from "./services";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AdminJWTStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AdminController],
    providers: [AdminAuthService,AdminJobsService ,AdminReportsService,AdminReviewsService, AdminJWTStrategy]
})
export class AdminAuthModule {}
