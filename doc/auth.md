# Auth API Specification

Base URL : /api/auth

## Register User
Endpoint
POST /api/auth/register

Deskripsi : mendaftarkan user baru ROLE OWNER

Request Body
```
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "secret",
  "phone_number": "08123456789"
}
```

Success Response (201 Created)
```
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone_number": "08123456789"
  }
}
```

Error Response (400 Bad Request)
```
{
  "status": 400,
  "message": "Email already registered",
  "data": null
}
```

## Login User
Endpoint
POST /api/auth/login

Request Body
```
{
  "email": "johndoe@example.com",
  "password": "secret"
}
```

Success Response (200 OK)
```
{
  "status": 200,
  "message": "Login success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone_number": "08123456789",
    "access_token": "jwt_token_here"
  }
}
```

Error Response (401 Unauthorized)
```
{
  "status": 401,
  "message": "Invalid email or password",
  "data": null
}
```

## Get Profile
Endpoint : GET /api/auth/profile

Deskripsi : Mengambil data profil user yang sedang login (authenticated user). Endpoint ini protected, sehingga hanya bisa diakses jika user mengirimkan token JWT yang valid.

- Headers : Bearer <access_token>

Request Body
Tidak ada request body (karena menggunakan method GET).

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

## Update Profile
Endpoint : PATCH /api/auth/profile

Deskripsi : User dapat mengupdate data dirinya sendiri, termasuk email dengan validasi. Endpoint ini hanya bisa dilakukan oleh ROLE OWNER

- Headers : Bearer <access_token>

Request Body : 
```
{
  "name": "John Doe Update",
  "email": "johndoe@example.com",
  "password": "secret123",
  "phone_number": "08987654321"
}
```

Responses Body (Success)
```
{
  "status" : 200,
  "message" : "User updated successfully",
  "data" : {
    "name": "John Doe Update",
    "email": "johndoe@example.com",
    "password": "secret123",
    "phone_number": "08987654321"
  }
}
```

Responses Body (Fail) :
- Bad Request (400)
```
{
  "status" : 400,
  "message" : "Email already in use",
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


## Logout 
Endpoint : PATCH /api/auth/profile

Deskripsi : Logout pengguna dan invalidate token. Memerlukan Bearer token di header Authorization.

- Headers : Bearer <access_token>

Response Body (Success) :
```
{
  "message" : "Logout Berhasil",
  "status" : 200
}
```