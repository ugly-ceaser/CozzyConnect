import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto, UpdateReminderDto } from '../dto/reminder';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  async create(@Body() createReminderDto: CreateReminderDto) {
    const result = await this.reminderService.create(createReminderDto);
    return result;
  }

  @Get()
  async findAll(@Param('userId') userId: string) {
    const result = await this.reminderService.findAll(userId);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.reminderService.findOne(id);
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateReminderDto: UpdateReminderDto) {
    const result = await this.reminderService.update(id, updateReminderDto);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.reminderService.remove(id);
    return result;
  }
}
