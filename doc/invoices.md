## Update Status Pembayaran Invoice (Oleh Admin / Webhook Midtrans)
Endpoint: PATCH /api/invoices/:id/status

Akses: ADMIN, SUPER_ADMIN, atau System Webhook

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
    "status": "PAID" // pilihan: UNPAID, PAID, EXPIRED, CANCELLED
}
```

### Responses Body (200):
```
{
  "status": 200,
  "message": "Invoice status updated to PAID",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-20260805-002",
    "status": "PAID"
  }
}
```

## Update Nominal / Rincian Invoice (Oleh Kasir / Admin)
Endpoint: PATCH /api/invoices/:id

Akses: ADMIN, SUPER_ADMIN

- Headers 
Authorization: Bearer <access_token>

### Request Body:
```
{
  "totalAmount": 350000,
  "paymentDueDate": "2026-08-05T18:00:00Z"
}
```

### Responses Body (200):
```
{
  "status": 200,
  "message": "Invoice amount updated successfully",
  "data": {
    "id": 1,
    "invoiceNumber": "INV-20260805-001",
    "totalAmount": 350000,
    "status": "UNPAID"
  }
}
```