import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '../dto/contact/create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }

  @Get()
  async getAllContacts() {
    return this.contactService.getAllContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: string) {
    return this.contactService.getContactById(Number(id));
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(Number(id));
  }
}
