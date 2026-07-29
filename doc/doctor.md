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

## 
