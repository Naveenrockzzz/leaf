# 📋 API Endpoints - Complete Table

## Legend
- ✅ **Implemented** - Working in the app
- ⚠️ **Partial** - Frontend exists, backend incomplete
- ❌ **Missing** - Needs to be implemented
- 🔐 **Protected** - Requires authentication
- 🌐 **Public** - No authentication needed

---

## Authentication & User Management

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/auth/signup` | POST | 🌐 | ✅ | `leafSlice.js:32` |
| `/auth/login` | POST | 🌐 | ✅ | `leafSlice.js:44` |
| `/auth/update-password` | POST | 🌐 | ⚠️ (typo) | `forgot-password.jsx:27` |
| `/auth/verify-otp` | POST | 🌐 | ❌ | - |
| `/auth/change-password` | PUT | 🔐 | ❌ | - |
| `/user-accounts/{id}` | GET | 🔐 | ✅ | `leafSlice.js:68` |
| `/user-accounts/{id}` | PUT | 🔐 | ✅ | `leafSlice.js:79` |

---

## Address Management

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/addresses` | POST | 🔐 | ✅ | `leafSlice.js:58` |
| `/addresses/{id}` | PUT | 🔐 | ✅ | `leafSlice.js:99` |
| `/addresses/{id}` | DELETE | 🔐 | ✅ | `leafSlice.js:91` |

---

## Products & Categories

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/products?populate=*` | GET | 🌐 | ✅ | `leafSlice.js:110` |
| `/products?filters[category][documentId][$eq]={id}` | GET | 🌐 | ✅ | `shop.jsx:47-49` |
| `/products?filters[title][$contains]={query}` | GET | 🌐 | ❌ | - |
| `/products/{id}` | GET | 🌐 | ⚠️ | Uses array filter |
| `/categories?populate=*` | GET | 🌐 | ✅ | `leafSlice.js:119` |

---

## Reviews (TO BE IMPLEMENTED)

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/reviews` | POST | 🔐 | ❌ | `review.jsx:98` (no API) |
| `/reviews?filters[product][documentId][$eq]={id}` | GET | 🌐 | ❌ | - |
| `/reviews/{id}` | PUT | 🔐 | ❌ | - |
| `/reviews/{id}` | DELETE | 🔐 | ❌ | - |

---

## Orders (TO BE IMPLEMENTED)

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/orders` | POST | 🔐 | ❌ | UI exists |
| `/orders?filters[user][documentId][$eq]={id}` | GET | 🔐 | ❌ | `order.jsx` |
| `/orders/{id}` | GET | 🔐 | ❌ | `order-details.jsx` |
| `/orders/{id}/status` | PUT | 🔐 | ❌ | - |
| `/orders/{id}` | DELETE | 🔐 | ❌ | - |

---

## Wishlist (TO BE IMPLEMENTED)

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/wishlists` | POST | 🔐 | ❌ | `wishlist.jsx` (local only) |
| `/wishlists?filters[user][documentId][$eq]={id}` | GET | 🔐 | ❌ | `wishlist.jsx` (local only) |
| `/wishlists/{id}` | DELETE | 🔐 | ❌ | - |

---

## Cart (TO BE IMPLEMENTED)

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/carts` | POST | 🔐 | ❌ | Redux only |
| `/carts?filters[user][documentId][$eq]={id}` | GET | 🔐 | ❌ | Redux only |
| `/carts/{id}` | PUT | 🔐 | ❌ | Redux only |
| `/carts/{id}` | DELETE | 🔐 | ❌ | Redux only |
| `/carts/clear/{userId}` | DELETE | 🔐 | ❌ | - |
| `/carts/merge` | POST | 🔐 | ❌ | - |

---

## File Upload (TO BE IMPLEMENTED)

| Endpoint | Method | Auth | Status | Location in Code |
|----------|--------|------|--------|------------------|
| `/upload` | POST | 🔐 | ❌ | `review.jsx:90` (no API) |

---

## External Services

### OTP Service (localhost:5000)

| Endpoint | Method | Status | Location in Code |
|----------|--------|--------|------------------|
| `/send-otp` | POST | ✅ | `email.jsx:27` |
| `/verify-otp` | POST | ❌ | `otp.jsx` (no API call) |

### Payment Service (localhost:5000)

| Endpoint | Method | Status | Location in Code |
|----------|--------|--------|------------------|
| `/create-payment-intent` | POST | ✅ | `payment-options.jsx:30` |

### RapidShyp Shipping API

| Endpoint | Method | Status | Location in Code |
|----------|--------|--------|------------------|
| `/serviceabilty_check` | POST | ✅ | `product-details.jsx:54` |

### Third-Party Public APIs

| Service | Endpoint | Status | Location in Code |
|---------|----------|--------|------------------|
| RestCountries | `/v3.1/alpha/{code}` | ✅ | `payment.jsx:16` |
| CountriesNow | `/countries/states` | ✅ | `address.jsx:32`, `update-address.jsx:48` |
| WhatsApp | Send message API | ✅ | `contact.jsx:59` |

---

## Issues by Endpoint

### ⚠️ Endpoints with Issues

| Endpoint | Issue | Priority | Fix |
|----------|-------|----------|-----|
| `/auth/update-password` | Typo: `update-passowrd` | 🔴 Critical | Line 27 in `forgot-password.jsx` |
| `/products` (shop.jsx) | Hardcoded URL | 🔴 Critical | Use environment variable |
| `/categories` (shop.jsx) | Hardcoded URL | 🔴 Critical | Use environment variable |
| `/send-otp` | Hardcoded URL | 🔴 Critical | Use environment variable |
| `/create-payment-intent` | Hardcoded URL | 🔴 Critical | Use environment variable |
| All protected endpoints | No auth header | 🔴 Critical | Add interceptor |

---

## Implementation Priority by Feature

### 🔴 Critical (Do First)
1. Fix environment variables
2. Add authorization headers
3. Fix API typo
4. Implement Orders API

### 🟡 Important (Do Second)
5. Implement Reviews API
6. Implement Cart persistence
7. Implement OTP verification
8. Implement Wishlist sync

### 🟢 Nice to Have (Do Later)
9. Product search endpoint
10. Image upload
11. Advanced filters
12. Order tracking

---

## API Call Patterns

### Standard GET Request
```javascript
import { get } from '../feature/api';

const data = await get('/products?populate=*');
```

### Standard POST Request
```javascript
import { post } from '../feature/api';

const response = await post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

### Standard PUT Request
```javascript
import { update } from '../feature/api';

const response = await update('/addresses/123', {
  data: { city: 'New City' }
});
```

### Standard DELETE Request
```javascript
import { remove } from '../feature/api';

const response = await remove('/addresses/123');
```

---

## Response Format Examples

### Success Response
```json
{
  "data": {
    "documentId": "abc123",
    "name": "Product Name",
    ...
  }
}
```

### Error Response
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid data provided"
  }
}
```

---

## Testing Checklist

### Working Endpoints (Test These)
- [ ] User signup
- [ ] User login
- [ ] Fetch user details
- [ ] Update user details
- [ ] Create address
- [ ] Update address
- [ ] Delete address
- [ ] Fetch products
- [ ] Fetch categories
- [ ] Shipping check

### Missing Endpoints (Implement Then Test)
- [ ] Create review
- [ ] Create order
- [ ] Add to wishlist
- [ ] Save cart
- [ ] Search products
- [ ] Upload images
- [ ] Verify OTP

---

## Quick Reference: Files to Update

### API Client
- `src/feature/api.js` - Add interceptors

### Authentication
- `src/Page/auth/forgot-password.jsx` - Fix typo
- `src/Page/auth/email.jsx` - Use env vars
- `src/Page/auth/otp.jsx` - Implement verification

### Shop
- `src/Page/shop/shop.jsx` - Replace hardcoded URLs
- `src/Page/shop/review.jsx` - Implement API
- `src/Page/shop/product-details.jsx` - Move RapidShyp token

### Orders & Cart
- `src/Page/profile/order.jsx` - Implement API
- `src/Page/cart/cart.jsx` - Implement persistence
- `src/Page/wishlist/wishlist.jsx` - Implement sync

### Payments
- `src/Page/UserOrder/payment/payment.jsx` - Use env var
- `src/Page/UserOrder/payment/payment-options.jsx` - Use env var

### Redux
- `src/feature/leafSlice.js` - Add new thunks

---

## Summary Statistics

| Category | Implemented | Partial | Missing | Total |
|----------|-------------|---------|---------|-------|
| Auth & User | 3 | 1 | 2 | 6 |
| Addresses | 3 | 0 | 0 | 3 |
| Products | 2 | 1 | 1 | 4 |
| Reviews | 0 | 0 | 4 | 4 |
| Orders | 0 | 0 | 5 | 5 |
| Wishlist | 0 | 0 | 3 | 3 |
| Cart | 0 | 0 | 6 | 6 |
| File Upload | 0 | 0 | 1 | 1 |
| External | 3 | 1 | 1 | 5 |
| **Total** | **11** | **3** | **23** | **37** |

**Completion Rate:** 30% (11/37 endpoints fully working)

---

**Need more details?** Check:
- `EXECUTIVE_SUMMARY.md` - Quick overview
- `API_ANALYSIS_REPORT.md` - Detailed analysis
- `API_ENDPOINTS_REFERENCE.md` - API documentation
- `FIXES_CHECKLIST.md` - Step-by-step fixes

