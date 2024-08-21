import { AuthGuard } from "@nestjs/passport";

export class AdminJWTGuard extends AuthGuard('admin-jwt') {
    constructor() {
        super();
    }
}
