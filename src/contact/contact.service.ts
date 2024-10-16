import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Adjust this path based on your project structure
import { Contact } from '@prisma/client';  // Assuming your Prisma Client is generated in the default location
import { CreateContactDto } from '../dto/contact/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(data: CreateContactDto): Promise<Contact> {
    return this.prisma.contact.create({
      data,
    });
  }

  async getAllContacts(): Promise<Contact[]> {
    return this.prisma.contact.findMany();
  }

  async getContactById(id: number): Promise<Contact | null> {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async deleteContact(id: number): Promise<Contact> {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
