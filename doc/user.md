# Users API Specification

Base URL : /api/users

## Get All User
Endpoint : GET /api/users

Deskripsi : Mengambil seluruh data user. Hanya dapat diakses oleh ADMIN / SUPER ADMIN

- Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method Get)

Responses Body (Success):
```
{
    "status" : 200,
    "message" : "Success",
    "data" : [
        {
            "id": 1,
            "name" : "John Doe",
            "email" : "johndoe@example.com",
            "role" : "OWNER"
        },
        {
            "id" : 2,
            "name" : "drh. Smith",
            "email" : "smith@example.com",
            "role" : "DOCTOR"
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

## Get User by ID
Endpoint : GET /api/users/:id

Deskripsi : Mengambil data user berdasarkan ID. Hanya dapat diakses oleh ADMIN / SUPER ADMIN.

- Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method Get)

Responses Body: 
```
{
    "status" : 200,
    "message" : "Success",
    "data" : {
        "id": 1,
        "name" : "John Doe",
        "email" : "johndoe@example.com",
        "role" : "OWNER",
        "createdAt": "2026-07-23T10:00:00.000Z"
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

## Post User 
Endpoint : POST /api/users

Deskripsi : 
Membuat user baru.

ADMIN → hanya bisa buat OWNER & DOCTOR
SUPER ADMIN → bisa buat ADMIN (namun admin tidak bisa membuat admin lain)

- Headers : Bearer <access_token>

Request Body :
```
{
    "name" : "drh.claire",
    "email" : "drhclaire@example.com",
    "password" : "supersecretpass",
    "phoneNumber" : "081212121212",
    "role" : "DOCTOR"
}
```

Success Response (201) 
```
{
    "status" : 201,
    "message" : "User created Successfully",
    "data" : {
        "id" : 3,
        "name" : "drh.claire",
        "email" : "drhclaire@example.com",
        "phoneNumber" : "081212121212",
        "role" : "DOCTOR"
    }
}
```

Error Response
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "Email already registered",
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

## Update User
Endpoint : PATCH /api/users/:id

Deskripsi : Digunakan untuk mengupdate akun user (ROLE OWNER, DOCTOR, ADMIN). Endpoint ini hanya dapat diakses oleh Super Admin (namun, admin yang di buat oleh Super Admin tidak bisa buat admin lain).

- Headers : Bearer <access_token>

Request Body :
```
{
    "name" : "drh.claire",
    "email" : "drhclaireupdate@example.com",
    "password" : "supersecretpassupdate",
    "phoneNumber" : "081234567890",
    "role" : "DOCTOR"
}
```

Response Body
Success Response (200) 
```
{
    "status" : 200,
    "message" : "User updated Successfully",
    "data" : {
        "id" : 3,
        "name" : "drh.claire",
        "email" : "drhclaire@example.com",
        "phoneNumber" : "081234567890",
        "role" : "DOCTOR"
    }
}
```

Error Response
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "Email already registered",
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

## Delete User
Endpoint : DELETE /api/users/:id

Deskripsi : 
Menghapus user (soft delete)

ADMIN → hanya delete OWNER & DOCTOR
SUPER ADMIN → bisa delete semua

- Headers : Bearer <access_token>

Response Body (Succes)
```
{
    "status": 200, 
    "message": "User deleted successfully", 
    "data": null
}
```

Response Body (Fail)
- Unauthorized Response (401)
Jika token tidak ada atau tidak valid:
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```