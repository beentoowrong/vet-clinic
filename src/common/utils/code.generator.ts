import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeGenerator {
    constructor(
        private readonly prismaService : PrismaService
    ){}

    async generateUniqueCode(prefix: string): Promise<string> {
        let code: string;
        let exists = true;

        while(exists) {
            code = `${prefix}-${dayjs().format('YYYYMMDD')}-${nanoid(8)}`;

            const found = await this.prismaService.appointment.findUnique({
                where: { appointmentCode: code }
            })

            if (!found) exists = false
        }

        return code!;
    }
}