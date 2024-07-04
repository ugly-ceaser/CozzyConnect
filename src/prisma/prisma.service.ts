import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';




@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources:{
                db:{
                    url: config.get('DATABASE_URL')
                }
            }

        });
    }

    async cleanDb() {
        await this.$transaction([
            this.chatMessage.deleteMany(), // Deletes all records from the `chatMessage` table
            this.review.deleteMany(), // Deletes all records from the `review` table
            this.report.deleteMany(), // Deletes all records from the `report` table
            this.reminder.deleteMany(), // Deletes all records from the `reminder` table
            this.notification.deleteMany(), // Deletes all records from the `notification` table
            this.search.deleteMany(), // Deletes all records from the `search` table
            this.contact.deleteMany(), // Deletes all records from the `contact` table
            this.propertyMarket.deleteMany(), // Deletes all records from the `propertyMarket` table
            this.jobMarket.deleteMany(), // Deletes all records from the `jobMarket` table
            this.realEstate.deleteMany(), // Deletes all records from the `realEstate` table
            this.user.deleteMany(), // Deletes all records from the `user` table
            this.userKyc.deleteMany(),
            // Add more deleteMany calls for other tables if needed
        ]);
    }
}
