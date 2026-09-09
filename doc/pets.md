# Pets API Specification

Base URL : /api/pets

## Get All Pets
Endpoint : GET /api/pets

Deskripsi : Mengambil seluruh data pet. Dapat diakses oleh ADMIN, SUPER ADMIN dan DOCTOR

- Headers : Bearer <access_token>

### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
``` 
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Milky",
      "species": {
        "id": 1,
        "name": "Dog"
      },
      "breed": {
        "id": 1,
        "name": "Labrador"
      },
      "gender": "MALE",
      "age": 1,
      "weightKg": 4.2,
      "specialMarks": "Full white fur color with black paw",
      "isSterilized": true,
      "owner": {
        "id": 1,
        "user": {
          "name": "Emmanuelle"
        }
      },
      "createdBy": 5,
      "createdAt": "2026-09-02T15:24:09.157Z"
    },
    {
      "id": 2,
      "name": "Pororo",
      "species": {
        "id": 1,
        "name": "Dog"
      },
      "breed": {
        "id": 1,
        "name": "Labrador"
      },
      "gender": "MALE",
      "age": 1,
      "weightKg": 4.2,
      "specialMarks": "White color and blue eyes",
      "isSterilized": true,
      "owner": {
        "id": 1,
        "user": {
          "name": "Emmanuelle"
        }
      },
      "createdBy": 5,
      "createdAt": "2026-09-03T02:17:33.818Z"
    },
    {
      "id": 3,
      "name": "Ikhsan",
      "species": {
        "id": 2,
        "name": "Cat"
      },
      "breed": {
        "id": 2,
        "name": "German Shepherd"
      },
      "gender": "MALE",
      "age": 1,
      "weightKg": 2,
      "specialMarks": "Different eye color",
      "isSterilized": false,
      "owner": {
        "id": 2,
        "user": {
          "name": "Laisya Ainun Nazwa"
        }
      },
      "createdBy": 6,
      "createdAt": "2026-09-03T03:34:30.247Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalData": 3,
    "totalPages": 1
  }
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

## Get Pet by ID
Endpoint : GET /api/pets/:id

Deskripsi : Mengambil data pet berdasarkan ID. Dapat diakses oleh ADMIN, SUPER ADMIN dan DOCTOR

- Headers : Bearer <access_token>

### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
```
{{
  "status": 200,
  "message": "Success",
  "data": {
    "id": 2,
    "name": "Pororo",
    "species": {
      "id": 1,
      "name": "Dog"
    },
    "breed": {
      "id": 1,
      "name": "Labrador"
    },
    "gender": "MALE",
    "age": 1,
    "weightKg": 4.2,
    "specialMarks": "White color and blue eyes",
    "isSterilized": true,
    "owner": {
      "id": 1,
      "user": {
        "name": "Emmanuelle"
      }
    },
    "createdBy": 5,
    "createdAt": "2026-09-03T02:17:33.818Z"
  }
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
  "message": "Pet not found",
  "data": null
}
```

## Get My Pets
Endpoint :  GET /api/pets/me

Deskripsi : Mengambil seluruh data pet. Hanya dapat diakses oleh OWNER.

Headers : Bearer <access_token>

### Request Body:
Tidak ada request body (karena menggunakan method GET)

### Responses Body (Success):
```
{
    "status" : 200,
    "message" : "Success",
    "data" : [
        {
          "id": 1,
          "name": "Pororo",
          "species": "Dog",
          "breed": "Siberian Husky",
          "gender": "MALE",
          "age": 3,
          "weightKg": 4,
          "specialMarks": "White color and blue eyes",
          "isSterilized": true,
        },
        {
            "id": 4,
            "name": "Miki",
            "species": "Cat",
            "breed": "Domestic",
            "gender": "MALE",
            "age": 1,
            "weightKg" : 2,
            "specialMarks": "Full black fur",
            "isSterilized": true
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
Jika user tidak memiliki data pet sama sekali
```
{
    "status": 404,
    "message" : "Not Found",
    "data": []
}
```

## Get My Pets by Id
Endpoint :  GET /api/pets/me/:id

Deskripsi : Mengambil 1 data pet berdasarkan ID. Hanya dapat diakses oleh OWNER.

Headers : Bearer <access_token>

### Request Body:
Tidak ada request body (karena menggunakan method GET)

### Responses Body (Success):
```
{
    "status" : 200,
    "message" : "Success",
    "data" : 
    {
      "id": 4,
      "name": "Miki",
      "species": "Cat",
      "breed": "Domestic",
      "gender": "MALE",
      "age": 1,
      "weightKg" : 2,
      "specialMarks": "Full black fur",
      "isSterilized": true
    }
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
Jika user tidak memiliki data pet sama sekali
```
{
    "status": 404,
    "message" : "Not Found",
    "data": null
}
```

## Post Pet
Endpoint : POST /api/pets

Deskripsi:  Membuat pet baru. Endpoint ini digunakan oleh role SUPER ADMIN, ADMIN dan OWNER

SUPER ADMIN, ADMIN -> create pet untuk siapa saja
OWNER -> create pet untuk dirinya sendiri

- Headers : Bearer <access_token>

### Request Body :
```
{
  "ownerId": 3,
  "name": "Miki",
  "species": "Cat",
  "breed": "Domestic",
  "gender": "MALE",
  "age": 1,
  "weightKg" : 4
  "specialMarks": "Full black fur",
  "isSterilized": true
}
```

### Responses Body (Success) :
Success Response (201)
```
{
    "status" : 201,
    "message": "Pet created successfully",
    "data" : {
      "ownerId": 3,
      "name": "Miki",
      "species": "Cat",
      "breed": "Domestic",
      "gender": "MALE",
      "age": 1,
      "weightKg" : 4
      "specialMarks": "Full black fur",
      "isSterilized": true
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
    "message": "You are not allowed to create pet", 
    "data": null 
}
```

## Update Pet
Endpoint : PATCH /api/pets/:id

Deskripsi : Mengubah data Pet. Endpoint ini digunakan oleh ROLE ADMIN dan OWNER.

Headers : Bearer <access_token>

### Request Body :
```
{
    "ownerId": 3,
    "name": "Miki",
    "species": "Cat",
    "breed": "Domestic",
    "gender": "MALE",
    "age": 1,
    "weightKg" : 4
    "specialMarks": "Full black fur",
    "isSterilized": true
}
```

### Responses Body (Success):
Success Responses (200)
```
{
    "status" : 200,
    "message" : "Pet updated succesfully",
    "data" : {
      "ownerId": 3,
      "name": "Pororo",
      "species": "Dog",
      "breed": "Siberian Husky",
      "gender": "MALE",
      "age" : 1,
      "weightKg" : 4
      "specialMarks": "Full black fur",
      "isSterilized": true
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
    "message": "You are not allowed to updated pet", 
    "data": null 
}
```

## Delete Pet 
Endpoint : DELETE /api/pets/:id

Deskripsi : Menghapus data Pet. Endpoint ini digunakan oleh ROLE ADMIN dan OWNER.

Headers : Bearer <access_token>

### Response Body (Success) : 
```
{
  "status": 200,
  "message": "Pet deleted successfully",
  "data": null
}
```

### Responses Body (Success):
- Bad Request (400)
```
{
  "status": 400,
  "message": "Pet has active appointments",
  "data": null
}
```
- Forbidden (403)
```
{
  "status": 403,
  "message": "You are not allowed to delete this pet",
  "data": null
}
```
