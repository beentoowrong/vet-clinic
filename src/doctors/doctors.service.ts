import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DoctorPaginationDto } from './dto/doctor-pagination.dto';
import { PaginatedDoctorsResponseDto } from './dto/paginated-doctors-response.dto';
import { parseEnv } from 'util';

@Injectable()
export class DoctorsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllDoctorPaginated(doctorPaginationDto:DoctorPaginationDto): Promise<PaginatedDoctorsResponseDto> {
        const {page, limit, search, specialization} = doctorPaginationDto

        const pageNum = Number(page)
        const limitNum = Number(limit)
        const skip = (pageNum - 1) * limitNum

        let whereCondition : any = {}

        if(doctorPaginationDto.specialization) {
            whereCondition.specialization = { contains: specialization, mode: 'insensitive' };
        }
        
        if(doctorPaginationDto.search){
            whereCondition.OR = [
                { specialization: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } }
            ]
        }

        const [doctors, totalData] = await Promise.all([
        this.prismaService.doctor.findMany({
            where: {
                ...whereCondition
            },
            skip,
            take: limit,
            select: {
            id: true,
            sipNumber: true,
            specialization: true,
            practiceDays: true,
            startTime: true,
            endTime: true,
            user: { select: { id: true, name: true } },
            },
            orderBy: { id: 'asc' },
        }),
            this.prismaService.doctor.count({ where: whereCondition }),
        ]);

        return {
            status: 200,
            message: 'Success',
            data: doctors,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalData: totalData,
                totalPages: Math.ceil(totalData / limitNum),
            },
        }
    }


    async getDoctorById(@Param('id', ParseIntPipe) DoctorId: number) {
        const doctor = await this.prismaService.doctor.findUnique({
            where: { id: DoctorId },
            select : {
                id: true,
                sipNumber: true,
                specialization: true,
                practiceDays: true,
                startTime: true,
                endTime: true,
                user: { select: { name: true } },
            }
        })

        if(!doctor) {
            return null
        }

        return {
            status: 200,
            message: 'Success',
            data: doctor,
        }
    }
}
