# Pets API Specification

Base URL : /api/pet-owners

## Get All Pet Owner
Endpoint : GET /api/pet-owners

Deskripsi: mengambil seluruh data pemilik hewan (Pet Owner). Dapat diakses oleh SUPER ADMIN, ADMIN, dan DOCTOR

- Headers :
Authorization : Bearer <access_token>
- Query Params: search (search nama/no HP), page, limit


### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 4,
      "userId": 10,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phoneNumber": "081234567890",
      "address": "Jl. Merdeka No. 10, Jakarta",
      "emergencyContact": "081987654321"
    }
  ]
}
```

### Response Body (Fail)
- Unauthorized (401)
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```
- Forbidden (403) 
Jika user tidak punya akses
```
{
    "status" : 403,
    "message" : "Forbidden",
    "data": null
}
```

## Get Pet Owner by ID
Endpoint : GET /api/pet-owners/:id

Deskripsi: mengambil data pemilik hewan (Pet Owner) berdasarkan Id. Dapat diakses oleh SUPER ADMIN, ADMIN, dan DOCTOR

- Headers :
Authorization : Bearer <access_token>
- Query Params: search (search nama/no HP), page, limit


### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 4,
      "userId": 10,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phoneNumber": "081234567890",
      "address": "Jl. Merdeka No. 10, Jakarta",
      "emergencyContact": "081987654321",
      "pets" : [
        {
            "id": 1,
            "petName": "Pororo",
            "petType": "Dog",
            "petRace": "Siberian Husky",
            "petGender": "MALE",
            "age": 3,
        }, 
        {
            "id": 10,
            "petName": "Moroll",
            "petType": "Cat",
            "petRace": "Caracal",
            "petGender": "MALE",
            "age": 3,
        }
      ]
    }
  ]
}
```
### Responses Body (Fail):
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
Jika user tidak punya akses:
```
{
  "status": 403,
  "message": "Forbidden",
  "data": null
}
```
- Not Found (404)
Jika data tidak ada
```
{
  "status": 404,
  "message": "Pet Owner not found",
  "data": null
}
```

## Update Pet Owner 
Endpoint : GET /api/pet-owners/:id

Deskripsi : Mengubah data spesifik pemilik (alamat / kontak darurat). Akses: ADMIN, SUPER_ADMIN, atau Owner yang bersangkutan.

- Headers :
Authorization : Bearer <access_token>
- Query Params: search (search nama/no HP), page, limit


### Request Body:
```
{
  "address": "Jl. Mawar Indah No. 45, Bandung",
  "emergencyContact": "089876543210"
}
```

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Pet owner profile updated successfully",
  "data": {
    "id": 4,
    "address": "Jl. Mawar Indah No. 45, Bandung",
    "emergencyContact": "089876543210"
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
    "message": "You are not allowed to updated pet owner", 
    "data": null 
}
```