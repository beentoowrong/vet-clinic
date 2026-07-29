# Users API Specification

Base URL: /api/doctors  

## Get All Doctor
Endpoint: GET /api/doctors

Deskripsi : Menampilkan daftar seluruh dokter beserta spesialisasi dan jadwal praktiknya. 
Public (Tidak butuh Token agar calon pengunjung web bisa melihat tim dokter klinik).

- Headers : none

### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": [
    {
        "id" : 1,
        "userId": 2,
        "name" : "Claire Johnattan",
        "sipNumber": "SIP-VET/2026/001",
        "specialization": "Bedah & Hewan Kecil",
        "practiceDays": "Senin - Jumat",
        "startTime": "08:00",
        "endTime": "16:00"
    },
  ]
}
```
### Response Body (Fail)
- Not Found (404)
Jika user tidak memiliki data doctor sama sekali
```
{
    "status": 404,
    "message" : "Not Found",
    "data": []
}
```

## Post Doctor
Endpoint : POST /api/doctors

Deskripsi : Membuat profil dokter yang ditautkan ke akun user (yang ber-role DOCTOR). Akses: ADMIN, SUPER_ADMIN.

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
  "userId": 2,
  "sipNumber": "SIP-VET/2026/001",
  "specialization": "Bedah & Hewan Kecil",
  "practiceDays": "Senin - Jumat",
  "startTime": "08:00",
  "endTime": "16:00"
}`
```

### Responses Body (Success):
```
{
    "status" : 201,
    "message" : "Doctor profile created succesfully",
    "data" : {
        "id": 1,
        "userId": 2,
        "sipNumber": "SIP-VET/2026/001",
        "specialization": "Bedah & Hewan Kecil",
        "practiceDays": "Senin - Jumat",
        "startTime": "08:00",
        "endTime": "16:00"
    }
}
```

### Responses Body (Fail):
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "User is not a DOCTOR or doctor profile already exists",
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
    "message": "Forbidden", 
    "data": null 
}
```

## Update Doctor
Endpoint : PATCH /api/doctors/:id

Deskripsi : Mengubah jadwal praktik, jam kerja, atau nomor SIP dokter Akses: ADMIN / SUPER_ADMIN

- Headers 
Authorization: Bearer <access_token>

### Responses Body (Success):
```
{
    "userId": 2,
    "sipNumber": "SIP-VET/2026/001",
    "specialization": "Bedah & Hewan Kecil",
    "practiceDays": "Senin - Jumat",
    "startTime": "08:00",
    "endTime": "16:00"
}
```

### Responses Body (Success):
```
{
    "status" : 201,
    "message" : "Doctor profile updated succesfully",
    "data" : {
        "id": 1,
        "sipNumber": "SIP-VET/2026/001",
        "specialization": "Bedah & Hewan Kecil",
        "practiceDays": "Senin - Jumat",
        "startTime": "09:00",
        "endTime": "17:00"
    }
}
```

## Delete Doctor
Endpoint : DELETE /api/doctors/:id

Deskripsi : 
Menghapus profile doctor, yang hanya bisa di lakukan oleh ROLE ADMIN / SUPERADMIN

- Headers : Bearer <access_token>

### Response Body (Success)
```
{
    "status": 200, 
    "message": "Doctor profile deleted successfully", 
    "data": null
}
