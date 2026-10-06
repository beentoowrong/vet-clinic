
export class PrescriptionResponseDto {
    id!: number;
    medicineName!: string;
    dosage!: string;
    frequency!: string;
    duration!: string;
    notes?: string;
}

export class DataMedicalRecordResponseDto {
    id!: number;
    recordCode!: string;
    appointmentId!: number;
    petId!: number;
    doctorId!: number;
    weightKg!: number;
    temperatureCelcius!: number;
    symptoms!: string;
    diagnosis!: string;
    treatment!: string;
    notes?: string;
    followUpDate?: string;
    createdAt? : string;
    prescription? : PrescriptionResponseDto[]
}

export class MedicalRecordResponseDto {
    status!: 201;
    message!: "Medical Record Successfuly Created";
    data!: DataMedicalRecordResponseDto;
}
