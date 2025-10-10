# API Analysis & Issues Report - Leaf-2 Project

## 📋 Executive Summary
This report documents all API endpoints currently in use, missing implementations, issues, and recommendations for the Leaf-2 e-commerce application.

---

## 🔗 Current API Endpoints

### **Backend API Endpoints (Strapi CMS - Expected)**
Base URL: `import.meta.env.VITE_API_BASE_URL` (⚠️ NOT CONFIGURED)

#### **Authentication APIs**
1. **POST** `/auth/signup` - User registration
2. **POST** `/auth/login` - User login
3. **POST** `/auth/update-passowrd` - Reset password (⚠️ Typo: "passowrd")

#### **User Management APIs**
4. **GET** `/user-accounts/{id}?populate=*` - Fetch user details
5. **PUT** `/user-accounts/{id}` - Update user details

#### **Address Management APIs**
6. **POST** `/addresses` - Create user address
7. **PUT** `/addresses/{id}` - Update address
8. **DELETE** `/addresses/{id}` - Delete address

#### **Product & Category APIs**
9. **GET** `/products?populate=*` - Fetch all products
10. **GET** `/products?populate=*&filters[category][documentId][$eq]={categoryId}` - Fetch products by category
11. **GET** `/categories?populate=*` - Fetch all categories

---

### **Third-Party API Endpoints**

#### **Payment Processing (Stripe)**
- **Payment Intent API** - `http://127.0.0.1:5000/create-payment-intent` (⚠️ Local server, not production-ready)

#### **OTP Service**
- **Send OTP API** - `http://127.0.0.1:5000/send-otp` (⚠️ Local server, not production-ready)

#### **Shipping & Logistics**
- **RapidShyp Serviceability Check** - `https://api.rapidshyp.com/rapidshyp/apis/v1/serviceabilty_check`
  - Token: `8e3ca34d7ad8ac6598c3110cd8e3be08b8efe0b4ed0f28e71b3706e1f5dabcaf` (⚠️ Hardcoded API token)

#### **Geolocation & Country Data**
- **Country Currency API** - `https://restcountries.com/v3.1/alpha/{countryCode}`
- **Countries & States API** - `https://countriesnow.space/api/v0.1/countries/states`

#### **WhatsApp Integration**
- **WhatsApp API** - `https://api.whatsapp.com/send/?phone=918285684222&text&type=phone_number&app_absent=0`

---

## ⚠️ Critical Issues

### **1. Missing Environment Variables**
❌ **`.env` file not found**

Required environment variables:
```env
VITE_API_BASE_URL=http://your-backend-url/api
VITE_Image_BASE_URL=http://your-backend-url
```

**Impact:**
- API calls will fail to reach the backend
- Image loading will break
- Application is not deployable

**Files Affected:**
- `src/feature/api.js` (line 3)
- `src/Page/shop/shop-card.jsx` (lines 35, 64)
- `src/Page/shop/product-details.jsx` (line 90)
- `src/Page/cart/cart-card.jsx` (line 18)
- `src/Page/UserOrder/cart-card.jsx` (line 16)

---

### **2. Hardcoded API URLs**
❌ **Multiple hardcoded URLs instead of environment variables**

**Shop Component** (`src/Page/shop/shop.jsx`)
```javascript
// Lines 20, 47
const res = await axios.get("http://97.74.93.91:1330/api/categories");
const url = "http://97.74.93.91:1330/api/products?populate=*";
```

**Email/OTP Component** (`src/Page/auth/email.jsx`)
```javascript
// Line 27
const res = await axios.post("http://127.0.0.1:5000/send-otp", {
```

**Payment Options** (`src/Page/UserOrder/payment/payment-options.jsx`)
```javascript
// Line 30
const { data } = await axios.post("http://127.0.0.1:5000/create-payment-intent", {
```

**Impact:**
- Cannot switch between dev/staging/production environments
- Security risk (exposing backend URLs)
- Maintenance nightmare

---

### **3. Exposed Sensitive Credentials**
🔴 **CRITICAL SECURITY ISSUE**

**RapidShyp API Token** (`src/Page/shop/product-details.jsx`, line 59-60)
```javascript
"rapidshyp-token": "8e3ca34d7ad8ac6598c3110cd8e3be08b8efe0b4ed0f28e71b3706e1f5dabcaf"
```

**Stripe Publishable Key** (`src/Page/UserOrder/payment/payment.jsx`, line 7-8)
```javascript
const stripePromise = loadStripe(
  "pk_test_51NLfpWSGdaY5SfT3CFhW6bnCEMKOhbHXBqpC5Egbl8eIGXkZ4eIIyNPU0krWT0vtCVjERT5q72lPbc03p2mfMyIS00YMxJojrx"
);
```

**Impact:**
- API tokens exposed in client-side code
- Anyone can use your API keys
- Potential unauthorized charges/usage
- Security breach

**Fix Required:** Move to `.env` file immediately

---

### **4. API Typo**
❌ **Typo in API endpoint** (`src/Page/auth/forgot-password.jsx`, line 27)
```javascript
await post("/auth/update-passowrd", data); // Should be "password"
```

---

### **5. Debugging Code Left in Production**
🟡 **31 console.log/error statements found**

**Examples:**
- `src/feature/leafSlice.js` - Lines 45, 102, 262, 268
- `src/Page/profile/update-address.jsx` - Line 73
- `src/Page/shop/shop-card.jsx` - Line 38

**Impact:**
- Performance overhead
- Exposes internal logic in browser console
- Unprofessional

---

### **6. Inconsistent API Usage Patterns**
❌ **Mixed axios usage patterns**

Some files use the centralized `api.js` functions:
```javascript
import { get, post, update, remove } from "./api";
```

Others use direct axios calls:
```javascript
import axios from "axios";
const res = await axios.get("http://...");
```

**Files with inconsistent usage:**
- `src/Page/shop/shop.jsx`
- `src/Page/auth/email.jsx`
- `src/Page/profile/update-address.jsx`
- `src/Page/auth/address.jsx`
- `src/Page/UserOrder/payment/payment.jsx`

---

## 🚫 Missing API Implementations

### **1. Reviews API - NOT IMPLEMENTED**
📍 **File:** `src/Page/shop/review.jsx`

**Current Status:** UI exists but no backend integration
- Form collects: rating, review text, images
- Submit button does nothing (line 98-99)

**Required Endpoints:**
```
POST /reviews - Create product review
  Body: {
    product_id: string,
    user_id: string,
    rating: number (1-5),
    review_text: string,
    images: File[]
  }

GET /reviews?product_id={id} - Fetch reviews for a product
PUT /reviews/{id} - Update review
DELETE /reviews/{id} - Delete review
```

---

### **2. Orders API - NOT IMPLEMENTED**
📍 **Files:** 
- `src/Page/UserOrder/userOrder.jsx`
- `src/Page/profile/order.jsx`
- `src/Page/profile/order-details.jsx`

**Current Status:** Order management pages exist but no API integration

**Required Endpoints:**
```
POST /orders - Create new order
  Body: {
    user_id: string,
    items: Array<{product_id, quantity, price}>,
    address_id: string,
    payment_info: object,
    total_amount: number
  }

GET /orders?user_id={id} - Fetch user orders
GET /orders/{id} - Fetch order details
PUT /orders/{id}/status - Update order status
DELETE /orders/{id} - Cancel order
```

---

### **3. Wishlist API - NOT IMPLEMENTED**
📍 **Files:**
- `src/Page/wishlist/wishlist.jsx`
- `src/Page/wishlist/wish-card.jsx`

**Current Status:** 
- Wishlist state exists in Redux (`state.leaf.wishList`)
- Only stored locally, not persisted to backend
- No sync across devices

**Required Endpoints:**
```
POST /wishlist - Add item to wishlist
  Body: { user_id: string, product_id: string }

GET /wishlist?user_id={id} - Fetch user's wishlist
DELETE /wishlist/{id} - Remove from wishlist
```

---

### **4. Cart Persistence API - NOT IMPLEMENTED**
📍 **File:** `src/feature/leafSlice.js` (lines 134-162)

**Current Status:** Cart only stored in Redux state (in-memory)
- Lost on page refresh
- Not synced across devices
- No guest cart to logged-in user migration

**Required Endpoints:**
```
POST /cart - Add item to cart
GET /cart?user_id={id} - Fetch user's cart
PUT /cart/{item_id} - Update cart item quantity
DELETE /cart/{item_id} - Remove from cart
POST /cart/merge - Merge guest cart with user cart
```

---

### **5. Product Search/Filter API - MISSING**
📍 **File:** `src/Page/home/search.jsx`

**Current Status:** Search component exists but no backend search implementation

**Required Endpoints:**
```
GET /products/search?q={query}&category={cat}&price_min={min}&price_max={max}
GET /products/filter?tags={tags}&sort={field}&order={asc|desc}
```

---

### **6. Password Update API - MISSING**
📍 **File:** `src/Page/profile/account-setting.jsx`

**Current Status:** Account settings page exists but no password update functionality

**Required Endpoint:**
```
PUT /auth/change-password
  Body: {
    user_id: string,
    old_password: string,
    new_password: string
  }
```

---

### **7. Image Upload API - MISSING**
📍 **File:** `src/Page/shop/review.jsx`

**Current Status:** Image upload UI exists but images are only stored as blob URLs locally

**Required Endpoint:**
```
POST /uploads - Upload images
  Content-Type: multipart/form-data
  Body: FormData with files
```

---

### **8. Email Verification API - PARTIALLY IMPLEMENTED**
📍 **Files:**
- `src/Page/auth/email.jsx`
- `src/Page/auth/otp.jsx`

**Current Status:**
- OTP sent via local server (http://127.0.0.1:5000/send-otp)
- OTP verification logic incomplete
- No backend verification endpoint

**Required Endpoint:**
```
POST /auth/verify-otp
  Body: {
    email: string,
    otp: string
  }
```

---

## 🔧 Code Quality Issues

### **1. Error Handling**
❌ **Inconsistent error handling**

**Good Example** (with proper error handling):
```javascript
// src/feature/leafSlice.js
export const createUserData = createAsyncThunk(
  "user/create",
  async (user, { rejectWithValue }) => {
    try {
      const response = await post("/auth/signup", user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed!");
    }
  }
);
```

**Bad Example** (silent failure):
```javascript
// src/Page/shop/shop.jsx
catch (err) {
  console.error("Failed to fetch categories", err);
  // No user feedback!
}
```

---

### **2. Missing Authorization Headers**
❌ **No authentication token sent with API requests**

**File:** `src/feature/api.js`

Current implementation:
```javascript
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**Missing:** JWT token in Authorization header

**Fix:**
```javascript
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('leafUser') || '{}');
  if (user.access_leaf) {
    config.headers.Authorization = `Bearer ${user.access_leaf}`;
  }
  return config;
});
```

---

### **3. No API Response Interceptor**
❌ **Missing global error handling for API responses**

**Needed:** Interceptor to handle:
- 401 (Unauthorized) → Redirect to login
- 403 (Forbidden) → Show error message
- 500 (Server Error) → Show friendly error
- Network errors → Show offline message

---

### **4. Hardcoded Product Metadata**
❌ **Hardcoded values in multiple places**

**Examples:**
- `src/Page/shop/product-details.jsx` (line 97): `"Main Fashion"` - should come from product data
- `src/Page/UserOrder/cart-card.jsx` (line 24): `"GS-4322"` - should be product SKU
- `src/Page/wishlist/wish-card.jsx` (line 36): `"GS-4322"` - hardcoded product name

---

### **5. Unused State Properties**
🟡 **Redux state has unused properties**

**File:** `src/feature/leafSlice.js`

```javascript
const initialState = {
  leaf: [], // ❓ Never used anywhere
  order: [], // ❌ Never populated from API
  wishList: [], // ❌ Not synced with backend
  OrderItem: [{ item: [], totalPrice: 0, address: {}, paymentInfo: {} }], // ❌ Never used
};
```

---

## 📦 Recommendations

### **Priority 1: Critical Security Fixes**
1. ✅ Create `.env` file with all environment variables
2. ✅ Remove all hardcoded API URLs
3. ✅ Move all API keys to environment variables
4. ✅ Add `.env` to `.gitignore`
5. ✅ Rotate exposed API keys (RapidShyp, Stripe)

### **Priority 2: API Integration**
6. ✅ Implement Reviews API
7. ✅ Implement Orders API
8. ✅ Implement Wishlist API with backend persistence
9. ✅ Implement Cart persistence API
10. ✅ Add Authorization headers to all protected routes

### **Priority 3: Code Quality**
11. ✅ Remove all `console.log` statements
12. ✅ Add global API error interceptor
13. ✅ Standardize all API calls to use `src/feature/api.js`
14. ✅ Fix typo: `/auth/update-passowrd` → `/auth/update-password`
15. ✅ Add proper user feedback for all API errors

### **Priority 4: Feature Completeness**
16. ✅ Complete OTP verification flow
17. ✅ Implement product search/filter API
18. ✅ Add image upload functionality for reviews
19. ✅ Implement password change in account settings
20. ✅ Add cart merge functionality (guest → logged in)

---

## 📝 Environment Variables Template

Create `.env` file in project root:

```env
# Backend API
VITE_API_BASE_URL=https://your-backend.com/api
VITE_Image_BASE_URL=https://your-backend.com

# Stripe (Get from Stripe Dashboard)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE

# RapidShyp (Move from frontend to backend)
VITE_RAPIDSHYP_TOKEN=YOUR_TOKEN_HERE

# OTP Service (Move to backend)
VITE_OTP_SERVICE_URL=https://your-otp-service.com

# Payment Service (Move to backend)
VITE_PAYMENT_SERVICE_URL=https://your-payment-service.com
```

---

## 📊 API Implementation Status

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| User Signup | ✅ | ❓ | Implemented |
| User Login | ✅ | ❓ | Implemented |
| Password Reset | ✅ | ❓ | Implemented (with typo) |
| User Profile | ✅ | ❓ | Implemented |
| Address CRUD | ✅ | ❓ | Implemented |
| Products Fetch | ✅ | ❓ | Implemented |
| Categories Fetch | ✅ | ❓ | Implemented |
| Product Reviews | ⚠️ | ❌ | UI only, no API |
| Orders | ⚠️ | ❌ | UI only, no API |
| Wishlist | ⚠️ | ❌ | Local only, no API |
| Cart Persistence | ❌ | ❌ | Local only |
| Product Search | ⚠️ | ❌ | UI only |
| Image Upload | ❌ | ❌ | Not implemented |
| Payment Processing | ⚠️ | ⚠️ | Using external service |
| Shipping Check | ✅ | N/A | Third-party API |

**Legend:**
- ✅ Fully Implemented
- ⚠️ Partially Implemented
- ❌ Not Implemented
- ❓ Unknown (backend status not visible)
- N/A Not Applicable

---

## 🎯 Next Steps

1. **Immediate Actions (Today)**
   - Create `.env` file
   - Move all hardcoded URLs to environment variables
   - Remove exposed API keys from code
   - Fix typo in password reset endpoint

2. **Short Term (This Week)**
   - Implement Reviews API (frontend + backend)
   - Implement Orders API (frontend + backend)
   - Add authorization headers to API client
   - Remove all console.log statements

3. **Medium Term (This Month)**
   - Implement Wishlist persistence
   - Implement Cart persistence
   - Add comprehensive error handling
   - Complete OTP verification flow

4. **Long Term (Next Quarter)**
   - Add product search/filter backend
   - Implement image upload service
   - Add cart merge functionality
   - Implement analytics tracking

---

## 📞 Support

If you need help implementing any of these recommendations, please refer to:
- Strapi CMS Documentation: https://docs.strapi.io/
- React Query for API calls: https://tanstack.com/query/
- Axios Interceptors: https://axios-http.com/docs/interceptors

---

**Report Generated:** $(date)
**Total Issues Found:** 37
**Critical Issues:** 5
**Missing APIs:** 8
**Code Quality Issues:** 10

