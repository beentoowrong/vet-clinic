# User API Specification

Base URL : /api/users

## Get All User
Endpoint : GET /api/users

Deskripsi : Mengambil seluruh data user. Endpoint ini hanya dapat diakses oleh ROLE ADMIN.

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

## Get User
Endpoint : GET /api/users/:id

Deskripsi : Mengambil data user berdasarkan id user (role owner/doctor). Endpoint ini hanya bisa digunakan oleh ROLE ADMIN.

- Headers : Bearer <access_token>

Request Body:
Tidak a darequest body (karena menggunakan method Get)

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
        "createdAt" : "2026-07-23"
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

