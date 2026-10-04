import { PrismaService } from "src/common/prisma/prisma.service";
import { UpdateAppointmentDto } from "../dto/update-appointment.dto";
import { InvoiceType, ServiceType } from "generated/prisma/enums";
import { CodeGenerator } from "src/common/utils/code.generator";
import { Injectable } from "@nestjs/common";


@Injectable()
export class InvoiceHelper {

    constructor(
        private readonly prismaService : PrismaService,
        private readonly codeGenerator : CodeGenerator
    ){}

    async handleTransportInvoice(appointmentId: number, updateAppointmentDto: UpdateAppointmentDto, existing: any) {
        const effectiveType = updateAppointmentDto.serviceType ?? existing.serviceType

        if (effectiveType !== ServiceType.HOME_VISIT) return;

        const dueDate = updateAppointmentDto.appointmentDate 
            ? new Date(updateAppointmentDto.appointmentDate)
            : existing.appointmentDate

        const invoice = await this.prismaService.invoice.findFirst({
                where: { appointmentId, type: InvoiceType.DP_TRANSPORT },
        })

        const invoiceCode = await this.codeGenerator.generateUniqueCode('INV')

        if (invoice) {
            await this.prismaService.invoice.update({
                where: {id: invoice.id},
                data: { totalAmount: updateAppointmentDto.transportFee }
            });
        } else {
            await this.prismaService.invoice.create({
                data: {
                    invoiceNumber: invoiceCode,
                    appointmentId,
                    type: InvoiceType.DP_TRANSPORT,
                    description: 'Down payment for home visit travel expenses',
                    totalAmount: updateAppointmentDto.transportFee ?? 0, // diisi admin via transportFee setelah cek jarak
                    paymentDueDate: dueDate
                }
            })
        }
    }
}