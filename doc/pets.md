# Pets API Specification

Base URL : /api/pets

## Get All Pets
Endpoint : GET /api/pets

Deskripsi : Mengambil seluruh data pet. Hanya dapat diakses oleh ADMIN / SUPER ADMIN

- Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method Get)

Responses Body (Success):
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
Response Body (Fail)
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
Endpoint : GET api/pets/:id

Deskripsi : Mengambil data pet berdasarkan ID. Hanya dapat diakses oleh ADMIN / SUPER ADMIN.

- Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method Get)

Responses Body (Success):
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

Responses Body (Fail):
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

## Get My Pets
Endpoint :  GET api/my-pets

Deskripsi : Mengambil seluruh data pet. Hanya dapat diakses oleh Owner.

Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method GET)

Responses Body:
```
{
    "status" : 200,
    "message" : "Success"
    "data" : [
        {
            "id": 1,
            "petName": "Pororo",
            "petType": "Dog",
            "petRace": "Siberian Husky",
            "petGender": "MALE",
            "age": 3,
        },
        {
            "id": 4,
            "petName": "Miki",
            "petType": "Cat",
            "petRace": "Domestic",
            "petGender": "MALE",
            "age": 1,
        }
    ]
}
```

Responses Body (Fail):
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

## Get My Pets by Id
Endpoint :  GET api/my-pets/:id

Deskripsi : Mengambil 1 data pet berdasarkan. Hanya dapat diakses oleh Owner.

Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method GET)

Responses Body:
```
{
    "status" : 200,
    "message" : "Success"
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

Responses Body (Fail):
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
Endpoint : POST api/pets

Deskripsi:  Membuat pet baru. Endpoint ini digunakan oleh role ADMIN dan OWNER

ADMIN -> create pet untuk siapa saja
OWNER -> create pet untuk dirinya sendiri

- Headers : Bearer <access_token>

Request Body 
```
{
    "petName": "Pororo",
    "petType": "Dog",
    "petRace": "Siberian Husky",
    "petGender": "MALE",
    "age" : 1
}
```

Success Response (201)
```
{
    "status" : 201,
    "message": "Pet created successfully",
    "data" : {
        "id" : 6,
        "petName" : "Pororo",
        "petType" : "Dog",
        "petRace" : "Siberian Husky",
        "petGender" : "MALE",
        "age" : 1
        "ownerId" : 3
    }
}
```

Error Response
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "Invalid input data"
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

