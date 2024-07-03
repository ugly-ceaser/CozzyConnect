import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {


    async responseHandler(message,status = false){

        return{
            response : message,
            status : status
        }

    }
}
