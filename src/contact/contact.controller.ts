// src/contact/contact.controller.ts

import { Controller, Post, Get, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '../dto/contact/create-contact.dto';
import { GetUser } from '../auth/decorator'; // Ensure this is the correct path for your decorator

import { JWTGaurd } from '../auth/gaurd'; // Ensure this is the correct path for your guard

@UseGuards(JWTGaurd)
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() createContactDto: CreateContactDto) {
    console.log(createContactDto)
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
