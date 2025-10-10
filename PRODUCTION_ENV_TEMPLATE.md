# 🔐 Production Environment Variables Template

## For VPC Deployment

Create this file as `.env` in your production server's frontend directory.

---

## 📝 Production .env File

```env
# ==============================================
# PRODUCTION ENVIRONMENT VARIABLES
# ==============================================
# Copy this template to .env and fill in your production values
# NEVER commit this file to git!

# ----------------------------------------------
# Backend API Configuration
# ----------------------------------------------
# Your production Strapi backend URL (without trailing slash)
# Example: https://api.yoursite.com
VITE_API_BASE_URL=https://YOUR_BACKEND_DOMAIN.com/api

# Base URL for serving images from Strapi
# Example: https://api.yoursite.com
VITE_Image_BASE_URL=https://YOUR_BACKEND_DOMAIN.com

# ----------------------------------------------
# Payment Configuration (STRIPE)
# ----------------------------------------------
# ⚠️ USE PRODUCTION KEY: pk_live_...
# Get from: https://dashboard.stripe.com/apikeys
# ⚠️ DO NOT USE the old exposed key - Get a NEW one!
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_NEW_STRIPE_PRODUCTION_KEY

# ----------------------------------------------
# Shipping Service (RapidShyp)
# ----------------------------------------------
# ⚠️ GET A NEW TOKEN - The old one was exposed
# Get from: https://www.rapidshyp.com/
# Login → Settings → API Keys → Generate New
VITE_RAPIDSHYP_TOKEN=YOUR_NEW_RAPIDSHYP_TOKEN

# ----------------------------------------------
# Backend Services (Node.js Express)
# ----------------------------------------------
# OTP Service URL (if you have a separate OTP microservice)
# If same backend, use: https://YOUR_BACKEND_DOMAIN.com
VITE_OTP_SERVICE_URL=https://YOUR_BACKEND_DOMAIN.com

# Payment Intent Service URL (if separate microservice)
# If same backend, use: https://YOUR_BACKEND_DOMAIN.com
VITE_PAYMENT_SERVICE_URL=https://YOUR_BACKEND_DOMAIN.com

# ----------------------------------------------
# WhatsApp Business API
# ----------------------------------------------
# WhatsApp business phone number (format: country code + number)
# Example: 918285684222 for India
VITE_WHATSAPP_PHONE=918285684222

# ----------------------------------------------
# Feature Flags (Optional)
# ----------------------------------------------
# Enable/disable features in production
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=true
VITE_ENABLE_CART_PERSISTENCE=true

# ----------------------------------------------
# Environment
# ----------------------------------------------
VITE_ENV=production
```

---

## 🔒 Security Checklist

Before deploying, ensure:

### ✅ API Keys
- [ ] Got NEW Stripe production key (pk_live_...)
- [ ] Got NEW RapidShyp token (old one was exposed)
- [ ] All keys are different from development
- [ ] Test keys are NOT used in production

### ✅ URLs
- [ ] Backend URL points to production
- [ ] Image URL points to production
- [ ] No localhost URLs anywhere
- [ ] HTTPS enabled for all URLs

### ✅ Services
- [ ] OTP service is accessible
- [ ] Payment service is accessible
- [ ] All external APIs are reachable
- [ ] Webhooks configured for production

---

## 📋 Backend Environment Variables

Your backend (Strapi) also needs these in production:

### Strapi .env (on production server)

```env
# Server
HOST=0.0.0.0
PORT=1337

# Database (PostgreSQL example)
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=your_database
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=true

# Secrets
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Frontend URL for CORS
CLIENT_URL=https://your-frontend-domain.com

# Upload Provider (if using S3 or similar)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_ACCESS_SECRET=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name

# Node Environment
NODE_ENV=production
```

---

## 🌐 Domain Configuration

### Example Production Setup:

```
Frontend: https://yourstore.com
Backend: https://api.yourstore.com
Database: Internal/Private
```

### Update These Files:

#### Frontend .env:
```env
VITE_API_BASE_URL=https://api.yourstore.com/api
VITE_Image_BASE_URL=https://api.yourstore.com
```

#### Backend middlewares.js:
```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://yourstore.com'],
    credentials: true,
  },
}
```

---

## 🔍 Verification Steps

After setting environment variables:

### 1. Test Backend Connection

```bash
# From your VPC, test backend API
curl https://api.yourstore.com/api/products

# Should return product list (or 401 for protected routes)
```

### 2. Test Frontend Build

```bash
cd /path/to/frontend

# Install dependencies
npm install

# Build with production env
npm run build

# Build should complete without errors
```

### 3. Test in Browser

```javascript
// Open browser console on your site
// Check if API URL is correct
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show: https://api.yourstore.com/api

// NOT: http://localhost:1337/api
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
- Use localhost URLs in production .env
- Use test Stripe keys (pk_test_...) in production
- Commit .env file to git
- Use the old exposed API keys
- Forget to rebuild after changing .env

### ✅ DO:
- Use HTTPS URLs everywhere
- Use production Stripe keys (pk_live_...)
- Get NEW API keys (rotate exposed ones)
- Keep .env in .gitignore
- Rebuild after changing .env

---

## 🚨 If You Deployed with Wrong Keys

### Quick Fix:

```bash
# 1. Stop the application
pm2 stop all  # or your process manager

# 2. Update .env file
nano .env
# Change the keys

# 3. Rebuild
npm run build

# 4. Restart
pm2 start all

# 5. Verify
# Test payment, shipping, etc.
```

---

## 📞 Get New API Keys

### Stripe (Payment):
1. Login: https://dashboard.stripe.com
2. Developers → API keys
3. Click "Create secret key"
4. Copy the **Publishable key** (starts with pk_live_)
5. Update VITE_STRIPE_PUBLISHABLE_KEY

### RapidShyp (Shipping):
1. Login: https://rapidshyp.com/login
2. Settings → API Integration
3. Generate New API Token
4. Copy the token
5. Update VITE_RAPIDSHYP_TOKEN

---

## ✅ Final Checklist

Before going live:

- [ ] All localhost URLs removed
- [ ] Production domains configured
- [ ] NEW API keys obtained and set
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] Test build succeeds
- [ ] Test payment works
- [ ] Test shipping calculation works

---

## 🎉 Environment Ready!

Your production environment variables are now configured correctly.

**Next Steps:**
1. Deploy backend with new .env
2. Deploy frontend with new .env
3. Test all functionality
4. Monitor for errors

---

**Security Status:** 🔒 Secured
**Configuration Status:** ✅ Ready
**Deployment Status:** 🚀 Go for Launch

---

**Last Updated:** Production Deployment
**Version:** Production v1.0

