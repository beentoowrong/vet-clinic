# Medical Records API Specification

Base URL : /api/medical-records

## Get Pet Medical History (Riwayat Rekam Medis per Hewan)
Endpoint : GET /api/medical-records/pet/:id

Deskripsi : Mengambil seluruh riwayat rekam medis dari 1 hewan tertentu dari yang terbaru hingga terlama. Akses: ADMIN, SUPER ADMIN, DOCTOR, & OWNER pemilik hewan tersebut.

- Headers
Authorization : Bearer <access_token>
- Query Parameters: page, limit

### Request Body
Tidak ada request body karena menggunakan method GET

### Response Body (Success)
```
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            "id": 501,
            "recordCode": "MR-20260805-012",
            "appointmentId": 101,
            "createdAt": "2026-08-05T11:15:00Z",
            "doctor": {
                "id": 2,
                "name": "drh. Sarah Wijaya"
            },
            "weightKg": 4.2,
            "temperatureCelsius": 38.5,
            "diagnosis": "Gastritis Akut akibat infeksi pencernaan ringan",
            "treatment": "Injeksi antiemetik (anti-muntah) dan pemberian vitamin",
            "prescriptionsCount": 2
        }
    ]
}
```

### Response Body (Fail)
- Unauthorized Responses (401)
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```
- Error Response (403 Forbidden) 
Jika user tidak punya akses
```
{
    "status" : 403,
    "message" : "Forbidden",
    "data": null
}
```

## Get Medical Record Detail by ID
Endpoint : GET /api/medical-records/:id

Deskripsi : Mengambil detail lengkap 1 rekam medis (termasuk list resep obat lengkap). Akses: ADMIN, SUPER ADMIN, DOCTOR, & OWNER pemilik hewan bersangkutan.

- Headers 
Authorization : Bearer <access_token>

### Request Body
Tidak ada request body karena menggunakan method GET

### Response Body (Success)
```
{
    "status": 200,
    "message": "Success",
    "data": {
        "id": 501,
        "recordCode": "MR-20260805-012",
        "createdAt": "2026-08-05T11:15:00Z",
        "appointment": {
            "id": 101,
            "appointmentCode": "APT-20260805-001",
            "appointmentDate": "2026-08-05",
            "serviceType": "CHECKUP"
        },
        "pet": {
            "id": 12,
            "petName": "Mimi",
            "petType": "Cat",
            "petRace": "Persian",
            "petGender": "FEMALE",
            "age": 2
        },
        "owner": {
            "id": 4,
            "name": "Budi Santoso",
            "phoneNumber": "081234567890"
        },
        "doctor": {
            "id": 2,
            "name": "drh. Sarah Wijaya",
            "sipNumber": "SIP-VET/2026/001"
        },
        "vitals": {
            "weightKg": 4.2,
            "temperatureCelsius": 38.5
        },
        "symptoms": "Muntah 3x sejak pagi, lemas, nafsu makan turun",
        "diagnosis": "Gastritis Akut akibat infeksi pencernaan ringan",
        "treatment": "Injeksi antiemetik (anti-muntah) dan pemberian vitamin",
        "prescriptions": [
            {
                "id": 1,
                "medicineName": "Ondansetron Syrup 4mg",
                "dosage": "0.5 ml",
                "frequency": "2x sehari sesudah makan",
                "duration": "5 hari",
                "notes": "Hentikan jika muntah sudah berhenti"
            },
            {
                "id": 2,
                "medicineName": "Nutri-Plus Gel",
                "dosage": "1 sendok teh",
                "frequency": "1x sehari",
                "duration": "7 hari",
                "notes": "Pencampur makanan untuk penambah nafsu makan"
            }
        ],
        "notes": "Kontrol ulang 3 hari lagi jika gejala muntah tidak berkurang",
        "followUpDate": "2026-08-08"
    }
}
```
### Response Body (Fail)
- Not Found (404)
```
{
    "status": 404,
    "message": "Medical record not found",
    "data": null
}
```

# Get Medical Record By Appointment ID
Endpoint: GET /api/medical-records/appointment/:id

Deskripsi : Mengambil rekam medis langsung berdasarkan ID Janji Temunya. Sangat berguna untuk Frontend saat membuka halaman detail appointment yang sudah selesai.

- Headers
Authorization : Bearer <access_token>

### Request Body
Tidak ada request body karena menggunakan methods GET

### Response Body (Success)
```
{
    "status": 200,
    "message": "Success",
    "data": {
        "id": 501,
        "recordCode": "MR-20260805-012",
        "createdAt": "2026-08-05T11:15:00Z",
        "appointment": {
            "id": 101,
            "appointmentCode": "APT-20260805-001",
            "appointmentDate": "2026-08-05",
            "serviceType": "CHECKUP"
        },
        "pet": {
            "id": 12,
            "petName": "Mimi",
            "petType": "Cat",
            "petRace": "Persian",
            "petGender": "FEMALE",
            "age": 2
        },
        "owner": {
            "id": 4,
            "name": "Budi Santoso",
            "phoneNumber": "081234567890"
        },
        "doctor": {
            "id": 2,
            "name": "drh. Sarah Wijaya",
            "sipNumber": "SIP-VET/2026/001"
        },
        "vitals": {
            "weightKg": 4.2,
            "temperatureCelsius": 38.5
        },
        "symptoms": "Muntah 3x sejak pagi, lemas, nafsu makan turun",
        "diagnosis": "Gastritis Akut akibat infeksi pencernaan ringan",
        "treatment": "Injeksi antiemetik (anti-muntah) dan pemberian vitamin",
        "prescriptions": [
            {
                "id": 1,
                "medicineName": "Ondansetron Syrup 4mg",
                "dosage": "0.5 ml",
                "frequency": "2x sehari sesudah makan",
                "duration": "5 hari",
                "notes": "Hentikan jika muntah sudah berhenti"
            },
            {
                "id": 2,
                "medicineName": "Nutri-Plus Gel",
                "dosage": "1 sendok teh",
                "frequency": "1x sehari",
                "duration": "7 hari",
                "notes": "Pencampur makanan untuk penambah nafsu makan"
            }
        ],
        "notes": "Kontrol ulang 3 hari lagi jika gejala muntah tidak berkurang",
        "followUpDate": "2026-08-08"
    }
}

```
### Response Body (Fail)
- Not Found (404)
```
{
    "status": 404,
    "message": "Medical record not found",
    "data": null
}
```


## Create Medical Record (Input Rekam Medis oleh Dokter)
Endpoint : POST /api/medical-records

Deskripsi : Dokter menginput hasil rekam medis pasien (termasuk keluhan, diagnosis, tindakan, resep obat, dan instruksi perawatan). Otomatis mengubah status Appointment terkait menjadi COMPLETED.

- Headers
Authorization : Bearer <access_token> (khusus DOCTOR)

### Request Body
```
{
    "appointmentId": 101,
    "petId": 12,
    "weightKg": 4.2,
    "temperatureCelsius": 38.5,
    "symptoms": "Muntah 3x sejak pagi, lemas, nafsu makan turun",
    "diagnosis": "Gastritis Akut akibat infeksi pencernaan ringan",
    "treatment": "Injeksi antiemetik (anti-muntah) dan pemberian vitamin",
    "prescriptions": [
        {
            "medicineName": "Ondansetron Syrup 4mg",
            "dosage": "0.5 ml",
            "frequency": "2x sehari sesudah makan",
            "duration": "5 hari",
            "notes": "Hentikan jika muntah sudah berhenti"
        },
        {
            "medicineName": "Nutri-Plus Gel",
            "dosage": "1 sendok teh",
            "frequency": "1x sehari",
            "duration": "7 hari",
            "notes": "Pencampur makanan untuk penambah nafsu makan"
        }
    ],
    "notes": "Kontrol ulang 3 hari lagi jika gejala muntah tidak berkurang",
    "followUpDate": "2026-08-08"
}
```
### Response Body (Success)
```
{
    "status": 201,
    "message": "Medical record created successfully and appointment status updated to COMPLETED",
    "data": {
        "id": 501,
        "recordCode": "MR-20260805-012",
        "appointmentId": 101,
        "petId": 12,
        "doctorId": 2,
        "weightKg": 4.2,
        "temperatureCelsius": 38.5,
        "symptoms": "Muntah 3x sejak pagi, lemas, nafsu makan turun",
        "diagnosis": "Gastritis Akut akibat infeksi pencernaan ringan",
        "treatment": "Injeksi antiemetik (anti-muntah) dan pemberian vitamin",
        "prescriptions": [
            {
                "id": 1,
                "medicineName": "Ondansetron Syrup 4mg",
                "dosage": "0.5 ml",
                "frequency": "2x sehari sesudah makan",
                "duration": "5 hari",
                "notes": "Hentikan jika muntah sudah berhenti"
            },
            {
                "id": 2,
                "medicineName": "Nutri-Plus Gel",
                "dosage": "1 sendok teh",
                "frequency": "1x sehari",
                "duration": "7 hari",
                "notes": "Pencampur makanan untuk penambah nafsu makan"
            }
        ],
        "notes": "Kontrol ulang 3 hari lagi jika gejala muntah tidak berkurang",
        "followUpDate": "2026-08-08",
        "createdAt": "2026-08-05T11:15:00Z"
    }
}
```
### Response Body (Fail)
- Bad Request (400)
Misal: Appointment sudah pernah dibuatkan rekam medisnya
```
{
    "status": 400,
    "message": "Medical record for this appointment already exists",
    "data": null
}
```
- Unauthorized (401)
```
{
    "status": 401,
    "message": "Unauthorized",
    "data": null
}
```
- Forbidden (403)
Misal: Owner / Admin biasa mencoba create rekam medis
```
{
    "status": 403,
    "message": "Only doctors can create medical records",
    "data": null
}
```