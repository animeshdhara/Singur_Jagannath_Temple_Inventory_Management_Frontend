# Backend Expectations for InventoryManagementSystemFrontend

## Overview
This frontend is a React + Vite inventory management system. It currently uses Axios with a base API URL defined in `src/services/api.js`:

- `VITE_API_URL` environment variable
- fallback: `http://localhost:5000/api`

The frontend currently uses mock login data in `src/components/login.jsx`, but the backend should eventually replace this with a real authentication API.

---

## API Contract

### Base URL
`<API_BASE_URL>/api`

### Product endpoints
The frontend depends on the following product endpoints:

#### GET /products
- Purpose: fetch the full product catalog
- Response: array of product objects
- Example response:
```json
[
  {
    "_id": "642a...",
    "barcode": "123456789012",
    "name": "Product Name",
    "price": 150.0,
    "stock": 12
  }
]
```

#### GET /products/:id
- Purpose: fetch one product for editing
- Response: single product object
- Example response:
```json
{
  "_id": "642a...",
  "barcode": "123456789012",
  "name": "Product Name",
  "price": 150.0,
  "stock": 12
}
```

#### POST /products
- Purpose: create a new product
- Request body:
```json
{
  "barcode": "123456789012",
  "name": "Product Name",
  "price": 150.0,
  "stock": 12
}
```
- Successful response: created product object or success confirmation

#### PUT /products/:id
- Purpose: update an existing product
- Request body is the same shape as POST above
- Example request body:
```json
{
  "barcode": "123456789012",
  "name": "Updated Name",
  "price": 160.0,
  "stock": 14
}
```
- Successful response: updated product object or success confirmation

#### DELETE /products/:id
- Purpose: delete a product by its ID
- Successful response: confirmation message

---

## Expected Product Model
Frontend code expects each product to include:
- `_id` (string)
- `barcode` (string)
- `name` (string)
- `price` (number)
- `stock` (number)

Optional backend fields can be added, but these fields must be present for frontend behavior.

---

## Frontend Behavior That Depends on Backend Data

### Home dashboard (`src/components/homePage.jsx`)
- Calls `GET /products`
- Computes:
  - `totalStock` = sum of `stock`
  - `lowStockCount` = count of products where `stock < 10`
  - `totalRevenue` = sum of `price * stock`
- Displays low-stock items and quick navigation cards.

### Inventory listing (`src/components/showStocks.jsx`)
- Calls `GET /products`
- Supports search by `name` or `barcode`
- Computes total inventory value and stock units
- Navigates to update route for editing products

### Delete product (`src/components/deleteItem.jsx`)
- Calls `GET /products`
- Calls `DELETE /products/:id`
- Expects `error.response.data.message` when errors happen

### Add product (`src/components/addItemForm.jsx`)
- Calls `POST /products`
- Expects backend validation and success response

### Update product (`src/components/updateItem.jsx`)
- Calls `GET /products/:id`
- Calls `PUT /products/:id`
- **Important note:** the current frontend route expects `id` via `useParams()`, but navigation from `ShowStocks` uses a query parameter (`?id=...`) instead of a path parameter. The backend should still provide RESTful `GET /products/:id` and `PUT /products/:id` endpoints. The frontend may need a small route fix later.

### Revenue analytics (`src/components/showReveneu.jsx`)
- Calls `GET /products`
- Computes top products by `price * stock`, total inventory value, total products, total stock, and average price per unit

### Billing (`src/components/showBill.jsx`)
- Currently only reads products via `GET /products`
- There is a commented-out placeholder for `POST /bills`
- Suggested backend extension:
  - `POST /bills`
  - Request body:
    ```json
    {
      "customerName": "John Doe",
      "customerPhone": "+91 9876543210",
      "items": [
        { "_id": "642a...", "name": "Product Name", "barcode": "...", "price": 150.0, "quantity": 2, "total": 300.0 }
      ],
      "subtotal": 300.0,
      "gst": 54.0,
      "total": 354.0,
      "date": "2026-04-18T12:34:56.789Z"
    }
    ```
  - Response could return the saved bill or a success status.

---

## Authentication and User Context

### Current frontend auth behavior
- Login is currently mocked in `src/components/login.jsx`
- Successful login stores:
  - `user` in `localStorage`
  - `authToken` in `localStorage`
- `src/context/UserContext.jsx` uses `authToken` existence to determine login state

### Recommended backend auth API
- `POST /auth/login` or `POST /login`
- Request body:
```json
{
  "email": "admin@singarmandir.com",
  "password": "admin123"
}
```
- Response body should include:
```json
{
  "token": "<jwt-or-session-token>",
  "user": {
    "name": "Admin User",
    "email": "admin@singarmandir.com",
    "phone": "+91 9876543210",
    "shopName": "Singur Jagannath Temple",
    "role": "Manager",
    "joinDate": "2026-04-18"
  }
}
```

### Notes for backend auth
- The frontend does not currently attach `Authorization` headers to Axios requests.
- If the backend enforces auth, a small frontend update will be needed to send `Authorization: Bearer <token>` or equivalent headers.
- Backend should return a `message` field in error responses when possible because frontend toast messages use `error.response?.data?.message`.

---

## Optional Backend Extensions

### User profile
Current profile/account pages are local-only. Backend endpoints that would improve integration:
- `GET /users/me`
- `PUT /users/me`

### Bill persistence
- `GET /bills` for bill history
- `POST /bills` to save invoices
- `GET /bills/:id` to retrieve a saved bill

### Search optimization
The frontend does client-side searching on product results. Backend-supported search could be added as:
- `GET /products?search=<query>`
- `GET /products?barcode=<barcode>`

---

## Error Handling Expectations

For requests that fail, frontend uses:
- `error.response?.data?.message`

Backend error responses should follow this structure when possible:
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Summary
The backend should support a simple CRUD product API and optionally a real auth/login flow.

Key required endpoints:
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Recommended future endpoints:
- `POST /auth/login`
- `POST /bills`
- `GET /users/me`
- `PUT /users/me`

This file is ready to share with the backend Copilot instance for implementation details.