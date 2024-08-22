import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '@prisma/client';
import { CreateContactDto } from '../dto/contact/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(data: CreateContactDto): Promise<{ data: Contact | null; success: boolean }> {
    try {
      const contact = await this.prisma.contact.create({
        data,
      });
      return { data: contact, success: true };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new InternalServerErrorException({
        success: false,
        data: null,
        message: 'Failed to create contact',
      });
    }
  }

  async getAllContacts(): Promise<{ data: Contact[] | null; success: boolean }> {
    try {
      const contacts = await this.prisma.contact.findMany();
      return { data: contacts, success: true };
    } catch (error) {
      console.error('Error retrieving contacts:', error);
      throw new InternalServerErrorException({
        success: false,
        data: null,
        message: 'Failed to retrieve contacts',
      });
    }
  }

  async getContactById(id: number): Promise<{ data: Contact | null; success: boolean }> {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException({
          success: false,
          data: null,
          message: `Contact with ID ${id} not found`,
        });
      }

      return { data: contact, success: true };
    } catch (error) {
      console.error(`Error retrieving contact with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        success: false,
        data: null,
        message: 'Failed to retrieve contact',
      });
    }
  }

  async deleteContact(id: number): Promise<{ data: Contact | null; success: boolean }> {
    try {
      const contact = await this.prisma.contact.delete({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException({
          success: false,
          data: null,
          message: `Contact with ID ${id} not found`,
        });
      }

      return { data: contact, success: true };
    } catch (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        success: false,
        data: null,
        message: 'Failed to delete contact',
      });
    }
  }
}
