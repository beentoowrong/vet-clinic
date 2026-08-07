# Auth API Specification

Base URL : /api/auth

## Register User
Endpoint : POST /api/auth/register

Deskripsi : Pendaftaran mandiri oleh Pemilik Hewan (Pet Owner). Hal ini akan otomais membuat record di table users dan table pet_owners.

### Request Body :
```
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "secretPassword123",
  "phoneNumber": "08123456789"
  "address": "Jl. Kebayoran Lama"
}
```

### Responses Body (Success):
Success (201 - Created)
```
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "08123456789",
    "address": "Jl. Kebayoran Lama",
    "role": "OWNER",
    "token": "jwt_token_here"
  }
}
```

### Responses Body (Fail):
Bad Request (400)
```
{
  "status": 400,
  "message": "Email already registered",
  "data": null
}
```

## Login User
Endpoint POST /api/auth/login

Deskripsi: Masuk ke sistem untuk mendapatkan token jwt.

### Request Body :
```
{
  "email": "johndoe@example.com",
  "password": "secret"
}
```

### Responses Body (Success):
Success (200-OK)
```
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com",
    }
  }
}
```

### Responses Body (Fail):
Error Response (401 Unauthorized)
```
{
  "status": 401,
  "message": "Invalid email or password",
  "data": null
}
```

## Logout 
Endpoint : POST /api/auth/logout

Deskripsi : Logout pengguna dan invalidate token. Memerlukan Bearer token di header Authorization.

- Headers 
Authorization: Bearer <access_token>

### Responses Body (Success):
```
{
  "status" : 200,
  "message" : "Logout Berhasil",
  "data": null
}
```