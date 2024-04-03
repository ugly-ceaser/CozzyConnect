import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    
    login(){
        return "i am signed up"
    }

    register(){

        return "i am registered"
    }
}