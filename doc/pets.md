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
      "petName": "Pororo",
      "petType": "Dog",
      "petRace": "Siberian Husky",
      "petGender": "MALE",
      "age": 3,
      "owner": {
        "id": 1,
        "name": "John Doe"
      }
    },
    {
      "id": 2,
      "petName": "Luna",
      "petType": "Cat",
      "petRace": "Domestic",
      "petGender": "FEMALE",
      "age": 1,
      "owner": {
        "id": 4,
        "name": "Jane Doe"
      }
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

## Get Pet by ID
Endpoint : GET /api/pets/:id

Deskripsi : Mengambil data pet berdasarkan ID. Dapat diakses oleh ADMIN, SUPER ADMIN dan DOCTOR

- Headers : Bearer <access_token>

### Request Body:
Tidak ada request body (karena menggunakan method Get)

### Responses Body (Success):
```
{
  "status": 200,
  "message": "Success",
  "data": 
    {
      "id": 1,
      "petName": "Pororo",
      "petType": "Dog",
      "petRace": "Siberian Husky",
      "petGender": "MALE",
      "age": 3,
      "owner": {
        "id": 1,
        "name": "John Doe"
      }
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
            "petName": "Pororo",
            "petType": "Dog",
            "petRace": "Siberian Husky",
            "petGender": "MALE",
            "age": 3
        },
        {
            "id": 4,
            "petName": "Miki",
            "petType": "Cat",
            "petRace": "Domestic",
            "petGender": "MALE",
            "age": 1
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
        "petName": "Miki",
        "petType": "Cat",
        "petRace": "Domestic",
        "petGender": "MALE",
        "age": 1
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

SUPER ADMIN ADMIN -> create pet untuk siapa saja
OWNER -> create pet untuk dirinya sendiri

- Headers : Bearer <access_token>

### Request Body :
```
{
  "ownerId": 3,
  "petName": "Pororo",
  "petType": "Dog",
  "petRace": "Siberian Husky",
  "petGender": "MALE",
  "age" : 1
}
```

### Responses Body (Success) :
Success Response (201)
```
{
    "status" : 201,
    "message": "Pet created successfully",
    "data" : {
      "ownerId" : 3
      "id" : 6,
      "petName" : "Pororo",
      "petType" : "Dog",
      "petRace" : "Siberian Husky",
      "petGender" : "MALE",
      "age" : 1,
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
    "petName": "Pororo",
    "petType": "Dog",
    "petRace": "Siberian Husky",
    "petGender": "MALE",
    "age" : 1
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
      "petName": "Pororo",
      "petType": "Dog",
      "petRace": "Siberian Husky",
      "petGender": "MALE",
      "age" : 1
    }
}
```

### Responses Body (Success):
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
    "message": "You are not allowed to create admin", 
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
