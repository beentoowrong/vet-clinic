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
  "phoneNumber": "08123456789"
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
    "phoneNumber": "08123456789"
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
    "phoneNumber": "08123456789",
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

## Logout 
Endpoint : POST /api/auth/logout

Deskripsi : Logout pengguna dan invalidate token. Memerlukan Bearer token di header Authorization.

- Headers : Bearer <access_token>

Response Body (Success) :
```
{
  "status" : 200,
  "message" : "Logout Berhasil",
}
```