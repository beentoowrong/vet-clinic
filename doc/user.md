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
- Not Found (404)
```
{
  "status": 404,
  "message": "User not found",
  "data": null
}
```

## Post User 
Endpoint : POST /api/users

Deskripsi : 
Membuat user baru.

- ADMIN → hanya bisa buat OWNER & DOCTOR (namun admin tidak bisa membuat admin lain)
- SUPER ADMIN → bisa buat ADMIN, OWNER, DOCTOR

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
    "message" : "User created successfully",
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
    "message" : "Invalid email format",
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

Deskripsi : Digunakan untuk mengupdate akun user, dilakukan oleh ADMIN dan SUPERADMIN

- Headers : Bearer <access_token>

Request Body :
```
{
    "name" : "drh.claire",
    "email" : "drhclaireupdate@example.com",
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
    "message" : "Email already registered or invalid",
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
    "message": "Forbiden", 
    "data": null 
}
```
- Not Found (404)
```
{
  "status": 404,
  "message": "User not found",
  "data": null
}
```

## Update Password User
Endpoint : PATCH /api/users/:id/password

Deskripsi : mengupdate password user, dilakukan oleh ADMIN dan SUPERADMIN

- Headers : Bearer <access_token>

Request Body 
```
{
    "oldPassword": "oldpassword", 
    "newPassword": "newsecurepassword" 
}
```

Response Body (Success):
```
{
    "status": 200, 
    "message": "Password updated successfully", 
    "data": null 
}
```


## Delete User
Endpoint : DELETE /api/users/:id

Deskripsi : 
Menghapus user (soft delete) yang hanya bisa di lakukan oleh ROLE ADMIN dan SUPERADMIN

- Headers : Bearer <access_token>

Response Body (Success)
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

## Get Current User
Endpoint: GET /api/users/me

Deskripsi: Mengambil data user yang sedang login

- Headers : Bearer <access_token>

Request Body:
Tidak ada request body (karena menggunakan method Get)

Responses Body (Success):
```
{
    "status" : 200,
    "message" : "Success",
    "data" : {
        "id" : 1,
        "name" : "John Doe",
        "email" : "johndoe@example.com",
        "role" : "OWNER",
        "createdAt" : "2026-07-23"
    }
}
```

Responses Body (fail) :
- Unauthorized Response (401) Jika token tidak ada atau tidak valid:
```
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```
- Forbidden Responses (403) Jika user tidak punya akses:
```
{
  "status": 403,
  "message": "Forbidden",
  "data": null
}
```

## Update Current User
ENDPOINT : PATCH /api/users/me

Deskripsi: User dapat mengupdate dirinya sendiri

Header : Bearer <access_token>

Request Body:
```
{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "08123456789",
}
```

Response Body (Success) :
```
{
    "status": 200,
    "message": "User updated successfully",
    "data" : {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phoneNumber": "08123456789"
    }
}
```

Response Body (Fail) :
Error Response
- Bad Request (400)
```
{
    "status" : 400,
    "message" : "Email already registered or invalid",
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


## Update Password Current User
ENDPOINT : PATCH /api/users/me/password

Deskripsi: User mengupdate password miliknya sendiri

Header : Bearer <access_token>

Request Body 
```
{
    "oldPassword": "oldpassword", 
    "newPassword": "newsecurepassword" 
}
```

Response Body (Success):
```
{
    "status": 200, 
    "message": "Password updated successfully", 
    "data": null 
}
```
