# Appointment API Specification

Base URL : /api/appointments

## Get All Appointment
Endpoint: GET /api/appointments

Deskripsi: Mengambil seluruh daftar janji temu. Hanya dapat diakses oleh ADMIN, SUPER ADMIN dan DOCTOR. Mendukung filter berdasarkan tanggal dan status.

- Headers 
Authorization: Bearer <access_token>
- Query Params: role(optional: ADMIN, DOCTOR, OWNER), page, limit

### Request Body:
Tidak ada request body karena menggunakan method GET.

### Responses Body (Success):
```
{
    "status": 200,
    "message": "Success",
    "data" : 
    [
        {
            "id" : 101,
            "appointment_code": "APT-20260805-001",
            "appointment_date": "2026-08-05",
            "appointment_time": "10:00",
            "service_type" : "CHECKUP",
            "status" : "CONFIRMED",
            "pet": {
                "id": 12,
                "name" : "Momo",
                "species" : "Cat"
            },
            "owner" : {
                "id": 4,
                "name": "Budi Santoso",
                "phone_number" : "08231234567"
            },
            "doctor" : {
                "id": 3,
                "name" "drh. Rita Asmawari"
            }
        }
    ]
}
```
### Responses Body (Fail):
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

## Get Appointment by ID
Endpoint: GET /api/appointments/:id

Deskripsi: Mengambil detail lengkap 1 janji temu berdasarkan ID. Akses: ADMIN, SUPER ADMIN, dan OWNER yang bersangkutan.

- Headers 
Authorization: Bearer <access_token>

### Request Body:
Tidak ada request body karena menggunakan method GET

### Responses Body (Success):
```
{
    "status": 200,
    "message": "Success",
    "data" : {
        "id": 101,
        "appointmentCode": "APT-20260805-001",
        "appointmentDate": "2026-08-05",
        "appointmentTime": "10:00",
        "complaint": "Muntah-muntah sejak kemarin dan tidak mau makan",
        "serviceType": "CHECKUP",
        "status": "CONFIRMED",
        "pet": {
            "id": 12,
            "petName": "Mimi",
            "petType": "Cat",
            "petRace": "Persian",
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
            "specialization": "Bedah & Hewan Kecil"
        }
    }
}
```
### Responses Body (Fail):
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
- Not Found (404)
```
{
    "status" : 403,
    "message" : "Forbidden",
    "data": null
}
```

## Post Appointment 
Endpoint : POST /api/appointments

Deskripsi : Membuat janji temu pemeriksaan. Dapat dilakukan oleh OWNER (untuk hewan miliknya) atau oleh ADMIN / SUPER ADMIN (untuk pendaftaran pasien via telepon/walk-in).

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
    "petId": 12,
    "doctorId": 2,
    "appointmentDate": "2026-08-05",
    "appointmentTime": "14:00",
    "serviceType": "HOME_VISIT", // Pilihan: IN_CLINIC, HOME_VISIT, TELECONSULTATION
    "complaint": "Anjing lemas tidak mau bangun, butuh dokter ke rumah",
    
    // Khusus jika serviceType == "HOME_VISIT"
    "homeVisitAddress": "Jl. Mawar No. 12, Jakarta Selatan"
}
```

### Responses Body (Success):
- Jika Responses Body serviceType : "HOME_VISIT"
```
{
    "status": 201,
    "message": "Home visit appointment created. Please proceed to payment for travel fee.",
    "data": {
        "id": 102,
        "appointmentCode": "HV-20260805-002",
        "serviceType": "HOME_VISIT",
        "status": "WAITING_FOR_PAYMENT", // Otomatis WAITING_FOR_PAYMENT untuk Home Visit
        "invoice": {
            "invoiceNumber": "INV-20260805-002",
            "totalAmount": 150000, // Biaya transport & visit awal
            "paymentDueDate": "2026-08-05T13:00:00Z"
        }
    }
}
```

- Jika Responses Body serviceType : "IN_CLINIC"
```
{
    "status": 201,
    "message": "Appointment created successfully.",
    "data": {
        "id": 103,
        "appointmentCode": "APT-20260805-003",
        "serviceType": "IN_CLINIC",
        "status": "CONFIRMED", // Otomatis CONFIRMED tanpa perlu bayar dulu
        "invoice": null // Invoice belum dibuat, nanti setelah periksa
    }
}
```

### Responses Body (Fail):
- Bad Request (400)
```
{
    "status": 400,
    "message": "Doctor is not available at the selected date and time",
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

## Update Appointment (Ubah Status Periksa)
Endpoint : PATCH /api/appointments/:id/status

Deskripsi : Mengubah status janji temu (misal: Admin mengonfirmasi pesanan, atau Dokter memulai pemeriksaan). Akses: ADMIN, SUPER ADMIN, DOCTOR.

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
    "status": "IN_PROGRESS" // Pilihan: CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
}
```

### Responses Body (Success):
```
{
    "status": 200,
    "message": "Appointment status updated to IN_PROGRESS",
    "data": {
        "id": 101,
        "status": "IN_PROGRESS"
    }
}
```
### Responses Body (Fail):
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "Invalid input data",
    "data" : null
}
```
- Unauthorized Response (401)
Jika token tidak ada atau tidak valid:
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```
- Forbidden Responses (403)
```
{ 
    "status": 403, 
    "message": "You are not allowed to updated appointments", 
    "data": null 
}
```


## Cancel Appointment (Batalkan Janji Temu)
Endpoint : PATCH /api/appointments/:id/cancel

Deskripsi : Membatalkan janji temu. Dapat dilakukan oleh OWNER (sebelum status berubah jadi IN_PROGRESS) atau oleh ADMIN.

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
    "cancelReason": "Ada keperluan mendadak"
}
```
### Responses Body (Success):
```
{
    "status": 200,
    "message": "Appointment cancelled successfully",
    "data": {
        "id": 101,
        "status": "CANCELLED",
        "cancelReason": "Ada keperluan mendadak"
    }
}
```
### Responses Body (Fail):
 Bad Request (400)
```
{
    "status" : 400,
    "message" : "Invalid input data",
    "data" : null
}
```
- Unauthorized Response (401)
Jika token tidak ada atau tidak valid:
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```
- Forbidden Responses (403)
```
{ 
    "status": 403, 
    "message": "You are not allowed to updated appointments", 
    "data": null 
}
```