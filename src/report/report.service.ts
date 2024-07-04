import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, UpdateReportDto } from '../dto/reportDto/';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}
 
  async create(createReportDto: CreateReportDto) {

    const { userId, ...rest } = createReportDto;
    return this.prisma.report.create({
      data:{

        ...rest,
        user: { connect: { id: userId } },
        

      }
    });
  }

  async findAll() {
    return this.prisma.report.findMany();
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    });
  }

  async remove(id: number) {
    return this.prisma.report.delete({
      where: { id },
    });
  }
}
