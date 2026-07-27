# Pets API Specification

Base URL : /api/pets

## Get All Pets
Endpoint : GET /api/pets

Deskripsi : Mengambil seluruh data pet. Hanya dapat diakses oleh ADMIN / SUPER ADMIN

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