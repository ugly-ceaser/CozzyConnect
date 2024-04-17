import { AuthGuard } from "@nestjs/passport";

export class JWTGaurd extends AuthGuard('jwt'){
    constructor(){
        super();
    }
}