# 🔧 Quick Fixes Checklist

Use this checklist to track your progress on fixing the issues found in the codebase.

---

## 🚨 CRITICAL FIXES (Do Today!)

### Security Issues
- [ ] Create `.env` file (copy from `env.example.txt`)
- [ ] Move hardcoded API URL from `src/Page/shop/shop.jsx` lines 20, 47
- [ ] Move hardcoded API URL from `src/Page/auth/email.jsx` line 27
- [ ] Move hardcoded API URL from `src/Page/UserOrder/payment/payment-options.jsx` line 30
- [ ] Move RapidShyp API token from `src/Page/shop/product-details.jsx` line 59 to `.env`
- [ ] Move Stripe key from `src/Page/UserOrder/payment/payment.jsx` line 7 to `.env`
- [ ] Verify `.env` is in `.gitignore`
- [ ] **⚠️ ROTATE exposed API keys** (contact RapidShyp & Stripe to get new keys)

### API Issues
- [ ] Fix typo in `src/Page/auth/forgot-password.jsx` line 27: `update-passowrd` → `update-password`

---

## 🔴 HIGH PRIORITY (This Week)

### API Client Improvements
- [ ] Add authorization interceptor to `src/feature/api.js`
  ```javascript
  axiosInstance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('leafUser') || '{}');
    if (user.access_leaf) {
      config.headers.Authorization = `Bearer ${user.access_leaf}`;
    }
    return config;
  });
  ```

- [ ] Add response error interceptor to `src/feature/api.js`
  ```javascript
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('leafUser');
        window.location.href = '/sign-in';
      }
      return Promise.reject(error);
    }
  );
  ```

### Standardize API Calls
- [ ] Update `src/Page/shop/shop.jsx` to use `get()` from `api.js` instead of direct axios
- [ ] Update `src/Page/auth/email.jsx` to use `post()` from `api.js`
- [ ] Update `src/Page/profile/update-address.jsx` to use centralized API client
- [ ] Update `src/Page/auth/address.jsx` to use centralized API client
- [ ] Update `src/Page/UserOrder/payment/payment.jsx` to use centralized API client

### Update Environment Variable Usage
- [ ] Update `src/Page/shop/shop.jsx`:
  ```javascript
  // Before:
  await axios.get("http://97.74.93.91:1330/api/categories");
  
  // After:
  await get("/categories");
  ```

- [ ] Update `src/Page/auth/email.jsx`:
  ```javascript
  // Before:
  await axios.post("http://127.0.0.1:5000/send-otp", {...});
  
  // After:
  const OTP_URL = import.meta.env.VITE_OTP_SERVICE_URL;
  await axios.post(`${OTP_URL}/send-otp`, {...});
  ```

- [ ] Update `src/Page/UserOrder/payment/payment.jsx`:
  ```javascript
  // Before:
  const stripePromise = loadStripe("pk_test_51NL...");
  
  // After:
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  ```

- [ ] Update `src/Page/shop/product-details.jsx`:
  ```javascript
  // Before:
  "rapidshyp-token": "8e3ca34d7ad8ac..."
  
  // After:
  "rapidshyp-token": import.meta.env.VITE_RAPIDSHYP_TOKEN
  ```

---

## 🟡 MEDIUM PRIORITY (This Month)

### Code Cleanup
- [ ] Remove console.log from `src/feature/leafSlice.js` line 45
- [ ] Remove console.log from `src/feature/leafSlice.js` line 262
- [ ] Remove console.log from `src/feature/leafSlice.js` line 268
- [ ] Remove console.log from `src/Page/shop/shop-card.jsx` line 38
- [ ] Remove console.log from `src/Page/cart/cart.jsx` line 14
- [ ] Remove console.log from `src/Page/profile/update-address.jsx` line 73
- [ ] Remove all other console statements (31 total found)

### Error Handling
- [ ] Add user feedback in `src/Page/shop/shop.jsx` catch blocks (lines 36-37, 54-55)
- [ ] Add proper error messages for all failed API calls
- [ ] Test error scenarios (network failure, 401, 403, 500)

---

## 🟢 NEW API IMPLEMENTATIONS (Next Sprint)

### Reviews API
- [ ] Backend: Create `/reviews` endpoint in Strapi
- [ ] Backend: Add review schema (product, user, rating, comment, images)
- [ ] Frontend: Implement `createReview` thunk in `leafSlice.js`
- [ ] Frontend: Implement `fetchReviews` thunk
- [ ] Frontend: Connect `src/Page/shop/review.jsx` submit button to API
- [ ] Frontend: Add image upload functionality

### Orders API
- [ ] Backend: Create `/orders` endpoint in Strapi
- [ ] Backend: Add order schema (user, items, address, payment, status)
- [ ] Frontend: Implement `createOrder` thunk in `leafSlice.js`
- [ ] Frontend: Implement `fetchOrders` thunk
- [ ] Frontend: Implement `fetchOrderDetails` thunk
- [ ] Frontend: Connect order pages to API
- [ ] Frontend: Add order status tracking

### Wishlist API
- [ ] Backend: Create `/wishlists` endpoint in Strapi
- [ ] Backend: Add wishlist schema (user, product)
- [ ] Frontend: Implement `addToWishlist` thunk
- [ ] Frontend: Implement `removeFromWishlist` thunk
- [ ] Frontend: Implement `fetchWishlist` thunk
- [ ] Frontend: Connect wishlist pages to API
- [ ] Frontend: Sync wishlist across devices

### Cart Persistence API
- [ ] Backend: Create `/carts` endpoint in Strapi
- [ ] Backend: Add cart schema (user, product, quantity)
- [ ] Frontend: Implement `syncCart` thunk
- [ ] Frontend: Implement `addToCart` API call
- [ ] Frontend: Implement `updateCartItem` API call
- [ ] Frontend: Implement `removeFromCart` API call
- [ ] Frontend: Add cart merge for guest → logged in user

### Search API
- [ ] Backend: Add search indexing in Strapi
- [ ] Backend: Create search endpoint with filters
- [ ] Frontend: Implement `searchProducts` thunk
- [ ] Frontend: Connect search component to API
- [ ] Frontend: Add filter options (price, category, rating)

---

## 📋 BACKEND TASKS (If you have backend access)

### Strapi Configuration
- [ ] Verify Strapi is running and accessible
- [ ] Check JWT authentication is enabled
- [ ] Verify `user-accounts` content type exists
- [ ] Verify `addresses` content type exists
- [ ] Verify `products` content type exists
- [ ] Verify `categories` content type exists
- [ ] Configure CORS to allow frontend origin

### New Content Types
- [ ] Create `reviews` content type
  - Fields: product (relation), user (relation), rating (number), comment (text), images (media)
- [ ] Create `orders` content type
  - Fields: user (relation), items (json), address (relation), payment (json), status (enum), totalAmount (decimal)
- [ ] Create `wishlists` content type
  - Fields: user (relation), product (relation)
- [ ] Create `carts` content type
  - Fields: user (relation), product (relation), quantity (integer)

### API Permissions
- [ ] Set up role-based permissions
- [ ] Allow authenticated users to create/read/update their own data
- [ ] Restrict delete operations
- [ ] Test permissions with Postman/Thunder Client

---

## 🧪 TESTING CHECKLIST

### API Testing
- [ ] Test signup flow end-to-end
- [ ] Test login flow end-to-end
- [ ] Test password reset flow
- [ ] Test address CRUD operations
- [ ] Test product fetching
- [ ] Test category fetching
- [ ] Test all new APIs once implemented

### Frontend Testing
- [ ] Test with `.env` variables
- [ ] Test authentication flow
- [ ] Test cart functionality
- [ ] Test wishlist functionality (when implemented)
- [ ] Test order creation (when implemented)
- [ ] Test review submission (when implemented)

### Error Scenarios
- [ ] Test with invalid credentials
- [ ] Test with expired token
- [ ] Test with network disconnected
- [ ] Test with invalid data
- [ ] Verify error messages are user-friendly

---

## 📦 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Remove all console.log statements
- [ ] Verify all environment variables are set
- [ ] Run build and check for errors
- [ ] Test production build locally
- [ ] Verify all API endpoints work with production URLs

### Deployment
- [ ] Set up production `.env` file
- [ ] Deploy backend (Strapi)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure environment variables in hosting platform
- [ ] Test live site thoroughly
- [ ] Monitor error logs for 24 hours

---

## 🎯 Quick Win Tasks (Can do right now!)

1. **Create `.env` file** (5 minutes)
   ```bash
   # Copy the template
   cp env.example.txt .env
   # Edit and fill in your values
   ```

2. **Fix API typo** (1 minute)
   - File: `src/Page/auth/forgot-password.jsx`
   - Line: 27
   - Change: `update-passowrd` → `update-password`

3. **Remove one console.log** (1 minute)
   - Pick any file from the list above
   - Remove or replace with proper error handling

4. **Add Authorization header** (10 minutes)
   - Open `src/feature/api.js`
   - Add the interceptor code from the HIGH PRIORITY section

---

## 📊 Progress Tracker

Track your overall progress:

- Security Fixes: 0/8 completed ( 0%)
- API Improvements: 0/10 completed ( 0%)
- Code Cleanup: 0/31 completed ( 0%)
- New APIs: 0/5 implemented ( 0%)
- Testing: 0/15 completed ( 0%)

**Total Progress: 0/69 tasks completed ( 0%)**

---

## 💡 Tips

1. **Start with security fixes** - These are the most critical
2. **Test after each change** - Don't break existing functionality
3. **Commit frequently** - Make small, atomic commits
4. **Ask for help** - If stuck, reach out to the team
5. **Document changes** - Update this checklist as you go

---

**Last Updated:** $(date)
**Next Review:** Schedule a review after completing HIGH PRIORITY tasks

