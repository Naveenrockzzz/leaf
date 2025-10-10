# API Endpoints Quick Reference

## 🔐 Authentication Endpoints

### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "alternatePhone": "string" (optional)
}

Response: {
  "user": {
    "documentId": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: {
  "user": {
    "documentId": "string",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```

### Update Password
```http
POST /auth/update-password
Content-Type: application/json

{
  "documentId": "string",
  "password": "string"
}
```

---

## 👤 User Management

### Get User Details
```http
GET /user-accounts/{userId}?populate=*
Authorization: Bearer {token}

Response: {
  "data": {
    "documentId": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "alternatePhone": "string",
    "addresses": []
  }
}
```

### Update User Details
```http
PUT /user-accounts/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "alternatePhone": "string"
  }
}
```

---

## 📍 Address Management

### Create Address
```http
POST /addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "address1": "string",
    "address2": "string",
    "city": "string",
    "district": "string",
    "state": "string",
    "pin_code": "string",
    "user_account": "userId"
  }
}
```

### Update Address
```http
PUT /addresses/{addressId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "address1": "string",
    "address2": "string",
    "city": "string",
    "district": "string",
    "state": "string",
    "pin_code": "string"
  }
}
```

### Delete Address
```http
DELETE /addresses/{addressId}
Authorization: Bearer {token}
```

---

## 🛍️ Products & Categories

### Get All Products
```http
GET /products?populate=*
```

### Get Products by Category
```http
GET /products?populate=*&filters[category][documentId][$eq]={categoryId}
```

### Get All Categories
```http
GET /categories?populate=*
```

---

## ⭐ Reviews (TO BE IMPLEMENTED)

### Create Review
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "product": "productId",
    "user": "userId",
    "rating": 1-5,
    "comment": "string",
    "images": ["imageId1", "imageId2"]
  }
}
```

### Get Product Reviews
```http
GET /reviews?filters[product][documentId][$eq]={productId}&populate=*
```

---

## 📦 Orders (TO BE IMPLEMENTED)

### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "user": "userId",
    "items": [
      {
        "product": "productId",
        "quantity": number,
        "price": number
      }
    ],
    "address": "addressId",
    "paymentInfo": {
      "method": "card|upi|cod",
      "transactionId": "string",
      "amount": number
    },
    "totalAmount": number,
    "status": "pending|processing|shipped|delivered|cancelled"
  }
}
```

### Get User Orders
```http
GET /orders?filters[user][documentId][$eq]={userId}&populate=*
Authorization: Bearer {token}
```

### Get Order Details
```http
GET /orders/{orderId}?populate=*
Authorization: Bearer {token}
```

### Update Order Status
```http
PUT /orders/{orderId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "status": "processing|shipped|delivered|cancelled"
  }
}
```

---

## 💚 Wishlist (TO BE IMPLEMENTED)

### Add to Wishlist
```http
POST /wishlists
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "user": "userId",
    "product": "productId"
  }
}
```

### Get User Wishlist
```http
GET /wishlists?filters[user][documentId][$eq]={userId}&populate=*
Authorization: Bearer {token}
```

### Remove from Wishlist
```http
DELETE /wishlists/{wishlistItemId}
Authorization: Bearer {token}
```

---

## 🛒 Cart (TO BE IMPLEMENTED)

### Add to Cart
```http
POST /carts
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "user": "userId",
    "product": "productId",
    "quantity": number
  }
}
```

### Get User Cart
```http
GET /carts?filters[user][documentId][$eq]={userId}&populate=*
Authorization: Bearer {token}
```

### Update Cart Item
```http
PUT /carts/{cartItemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": {
    "quantity": number
  }
}
```

### Remove from Cart
```http
DELETE /carts/{cartItemId}
Authorization: Bearer {token}
```

### Clear Cart
```http
DELETE /carts/clear/{userId}
Authorization: Bearer {token}
```

---

## 📤 File Upload (TO BE IMPLEMENTED)

### Upload Files
```http
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  files: File[] (multiple files)
  ref: "string" (optional - related content type)
  refId: "string" (optional - related content id)
  field: "string" (optional - field name)

Response: [
  {
    "id": "string",
    "url": "string",
    "name": "string",
    "formats": {}
  }
]
```

---

## 🔍 Search (TO BE IMPLEMENTED)

### Search Products
```http
GET /products?filters[title][$contains]={query}&populate=*
```

### Advanced Search
```http
GET /products?filters[title][$contains]={query}&filters[category][documentId][$eq]={categoryId}&filters[price][$gte]={minPrice}&filters[price][$lte]={maxPrice}&populate=*
```

---

## 📧 OTP Service (External - localhost:5000)

### Send OTP
```http
POST http://127.0.0.1:5000/send-otp
Content-Type: application/json

{
  "email": "string"
}

Response: {
  "otp": "string",
  "message": "OTP sent successfully"
}
```

### Verify OTP (TO BE IMPLEMENTED)
```http
POST http://127.0.0.1:5000/verify-otp
Content-Type: application/json

{
  "email": "string",
  "otp": "string"
}
```

---

## 💳 Payment Service (External - localhost:5000)

### Create Payment Intent
```http
POST http://127.0.0.1:5000/create-payment-intent
Content-Type: application/json

{
  "currency": "inr|usd",
  "amount": number (in smallest currency unit)
}

Response: {
  "clientSecret": "string"
}
```

---

## 🚚 Shipping Service (RapidShyp)

### Check Serviceability
```http
POST https://api.rapidshyp.com/rapidshyp/apis/v1/serviceabilty_check
Content-Type: application/json
rapidshyp-token: {YOUR_TOKEN}

{
  "Pickup_pincode": "string",
  "Delivery_pincode": "string",
  "cod": boolean,
  "total_order_value": number,
  "weight": number
}

Response: {
  "data": {
    "delivery_available": boolean,
    "delivery_days": number,
    "shipping_charge": number
  }
}
```

---

## 🌍 Third-Party APIs

### Get Country Currency
```http
GET https://restcountries.com/v3.1/alpha/{countryCode}

Response: {
  "currencies": {
    "INR": {
      "name": "Indian rupee",
      "symbol": "₹"
    }
  }
}
```

### Get Countries and States
```http
GET https://countriesnow.space/api/v0.1/countries/states

Response: {
  "data": [
    {
      "name": "India",
      "states": [
        { "name": "Maharashtra" },
        { "name": "Gujarat" }
      ]
    }
  ]
}
```

---

## 📝 Implementation Priority

### Phase 1: Critical (Implement First)
1. ✅ Fix environment variables
2. ✅ Add Authorization headers
3. ⬜ Orders API (create, list, details)
4. ⬜ Cart persistence API
5. ⬜ OTP verification API

### Phase 2: Important (Implement Second)
6. ⬜ Reviews API (create, list)
7. ⬜ Wishlist API (add, remove, list)
8. ⬜ Image upload API
9. ⬜ Product search API

### Phase 3: Enhancement (Implement Later)
10. ⬜ Advanced filters
11. ⬜ Order tracking
12. ⬜ Notifications API
13. ⬜ User preferences API

---

## 🔧 Common Request Headers

```javascript
// For authenticated requests
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {jwt_token}"
}

// For file uploads
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {jwt_token}"
}
```

---

## ⚠️ Error Response Format

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": {}
  }
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📚 Resources

- Strapi REST API Docs: https://docs.strapi.io/dev-docs/api/rest
- Stripe API Docs: https://stripe.com/docs/api
- RapidShyp API Docs: https://www.rapidshyp.com/docs

