import { PaginationDto } from "../dto/pagination.dto";

export const buildWhereCondition = (paginationDto: PaginationDto) => {
    const { search, id, appointmentCode, serviceType, status } = paginationDto;

    const whereCondition: any = {};

    if (search) {
        whereCondition.OR = [
            { appointmentCode: { contains: search, mode: 'insensitive' } },
            { pet: { name: { contains: search, mode: 'insensitive' } } },
            { owner: { user: { name: { contains: search, mode: 'insensitive' } } } },
        ]
    }

    if (id) whereCondition.id = id
    if (appointmentCode) whereCondition.appointmentCode = appointmentCode
    if (serviceType) whereCondition.serviceType = serviceType
    if (status) whereCondition.status = status

    return whereCondition;
}