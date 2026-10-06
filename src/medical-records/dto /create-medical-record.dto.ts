import { PrescriptionDto } from "./prescription.dto";


export class CreateMedicalRecordDto {
    weightKg!: number;
    temperatureCelcius!: number;
    symptoms!: string;
    diagnosis!: string;
    treatment!: string;
    notes?: string;
    followUpDate?: string;
    prescription? : PrescriptionDto[]
}