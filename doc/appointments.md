# Appointment API Specification

Base URL : /api/appointments

## Get All Appointment
Endpoint: GET /api/appointments

Deskripsi: Mengambil daftar seluruh janji temu.

Akses: ADMIN, SUPER ADMIN, DOCTOR

- Headers 
Authorization: Bearer <access_token>
- Query Params: 
1. status (optional: WAITING_FOR_PAYMENT, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
2. date (optional: YYYY-MM-DD)
3. page (optional, default 1)
4. limit (optional, default 10)

### Request Body:
Tidak ada request body karena menggunakan method GET.

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 101,
      "appointmentCode": "APT-20260805-001",
      "appointmentDate": "2026-08-05",
      "appointmentTime": "10:00",
      "serviceType": "IN_CLINIC",
      "status": "CONFIRMED",
      "pet": {
        "id": 12,
        "name": "Momo",
        "species": "Cat"
      },
      "owner": {
        "id": 4,
        "name": "Budi Santoso",
        "phoneNumber": "08231234567"
      },
      "doctor": {
        "id": 3,
        "name": "drh. Rita Asmawari"
      },
      "invoice": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalData": 1,
    "totalPages": 1
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

## Get Appointment by ID
Endpoint: GET /api/appointments/:id

Deskripsi: Mengambil detail lengkap 1 janji temu berdasarkan ID (termasuk status Invoice terkait).

Akses: ADMIN, SUPER ADMIN, DOCTOR, dan OWNER (yang memiliki hewan tersebut)

- Headers 
Authorization: Bearer <access_token>

### Request Body:
Tidak ada request body karena menggunakan method GET

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": 101,
    "appointmentCode": "APT-20260805-001",
    "appointmentDate": "2026-08-05",
    "appointmentTime": "10:00",
    "serviceType": "HOME_VISIT",
    "status": "WAITING_FOR_PAYMENT",
    "complaint": "Kucing lemas dan tidak mau makan",
    "homeVisitAddress": "Jl. Mawar No. 12, Jakarta Selatan",
    "cancelReason": null,
    "pet": {
      "id": 12,
      "name": "Mimi",
      "species": "Cat",
      "breed": "Persian",
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
    },
    "invoice": {
      "id": 1,
      "invoiceNumber": "INV-20260805-001",
      "totalAmount": 150000,
      "status": "UNPAID",
      "paymentDueDate": "2026-08-05T13:00:00Z"
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

Deskripsi :Membuat pendaftaran janji temu baru.
- Jika serviceType = HOME_VISIT: Otomatis membuatkan Invoice DP Transportasi dan status menjadi WAITING_FOR_PAYMENT
- Jika serviceType = IN_CLINIC: Langsung CONFIRMED dan invoice bernilai null (diisi di kasir nanti).

Akses: OWNER, ADMIN, SUPER ADMIN.

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
  "homeVisitAddress": "Jl. Mawar No. 12, Jakarta Selatan" // Wajib diisi jika HOME_VISIT
}
```

### Responses Body (Success):
- Jika Responses Body serviceType : "HOME_VISIT"
```
{
  "status": 201,
  "message": "Home visit appointment created. Please proceed to payment.",
  "data": {
    "id": 102,
    "appointmentCode": "HV-20260805-002",
    "serviceType": "HOME_VISIT",
    "status": "WAITING_FOR_PAYMENT",
    "invoice": {
      "id": 2,
      "invoiceNumber": "INV-20260805-002",
      "totalAmount": 150000,
      "status": "UNPAID",
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
    "status": "CONFIRMED",
    "invoice": null
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

Deskripsi : Mengubah status jalannya pemeriksaan (misal: Pasien datang & dokter mulai memeriksa).

Akses: ADMIN, SUPER ADMIN, DOCTOR

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
        "appointmentCode": "APT-20260805-001",
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

Deskripsi: Membatalkan janji temu. Jika ada Invoice berstatus UNPAID, invoice akan otomatis berubah jadi CANCELLED.

Akses: OWNER (sebelum status IN_PROGRESS), ADMIN, SUPER_ADMIN

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
    "status": 400,
    "message": "Doctor is not available at the selected date and time",
    "data": null
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