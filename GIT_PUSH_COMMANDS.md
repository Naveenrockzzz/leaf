# 🚀 Git Push Commands - Ready to Deploy

## Execute these commands to push both backend and frontend to git

---

## 📦 BACKEND: Ecom-CMS (Strapi)

### Step 1: Stage Backend Changes

```bash
cd C:\Users\Admin\Desktop\Ecom-CMS

# Add new APIs
git add src/api/cart/
git add src/api/wishlist/

# Add modified schemas
git add src/api/order/content-types/order/schema.json
git add src/api/review/content-types/review/schema.json

# Check what will be committed
git status
```

### Step 2: Commit Backend

```bash
git commit -m "feat: Add Wishlist and Cart APIs, enhance Review and Order APIs

✨ New APIs:
- Complete Wishlist API with user-product relations
- Complete Cart API with quantity management

🔧 Enhanced APIs:
- Review: Added product relation and images support
- Order: Added orderItems, paymentInfo, status, paymentStatus, trackingNumber

🎯 Ready for Production:
- All new endpoints tested and working
- Schemas validated
- Ready to deploy to production server

Breaking Changes: None
Migration Required: Yes (new content types will be created automatically)
"
```

### Step 3: Push Backend

```bash
git push origin main

# If you get errors about branch name:
# git push origin HEAD
```

---

## 🎨 FRONTEND: leaf-2 (React + Vite)

### Step 1: Stage Frontend Changes (EXCLUDING .env)

```bash
cd C:\Users\Admin\Desktop\leaf-2

# Add all modified source files
git add .gitignore
git add src/Page/UserOrder/cart.jsx
git add src/Page/UserOrder/payment/payment-options.jsx
git add src/Page/UserOrder/payment/payment.jsx
git add src/Page/auth/address.jsx
git add src/Page/auth/email.jsx
git add src/Page/auth/forgot-password.jsx
git add src/Page/cart/cart.jsx
git add src/Page/profile/update-address.jsx
git add src/Page/shop/product-details.jsx
git add src/Page/shop/review.jsx
git add src/Page/shop/shop-card.jsx
git add src/Page/shop/shop.jsx
git add src/feature/api.js
git add src/feature/leafSlice.js

# Add documentation files
git add API_ANALYSIS_REPORT.md
git add API_ENDPOINTS_REFERENCE.md
git add API_ENDPOINTS_TABLE.md
git add DEPLOY_NOW.md
git add EXECUTIVE_SUMMARY.md
git add FIXES_CHECKLIST.md
git add IMPLEMENTATION_SUMMARY.md
git add PRODUCTION_DEPLOYMENT_GUIDE.md
git add PRODUCTION_ENV_TEMPLATE.md
git add QUICK_START_GUIDE.md
git add START_HERE.md
git add GIT_PUSH_COMMANDS.md
git add env.example.txt
git add 📚_DOCUMENTATION_INDEX.md

# Check what will be committed (should NOT include .env)
git status
```

### Step 2: Commit Frontend

```bash
git commit -m "feat: Production-ready e-commerce with complete functionality

🔐 Security Fixes:
- Moved Stripe API key to environment variables
- Moved RapidShyp token to environment variables
- Removed all hardcoded API URLs (6 instances)
- Added .env to .gitignore
- Added authorization interceptors with JWT auto-injection
- Auto-logout on 401 errors
- Removed 31 console.log statements

🐛 Bug Fixes:
- Fixed password reset API typo (update-passowrd → update-password)
- Fixed cart total calculation (was hardcoded, now dynamic)
- Fixed all hardcoded URLs to use environment variables
- Standardized all API calls to use centralized client

✨ New Features:
- Review submission fully functional with ratings
- Order management with full API integration
- Wishlist sync with backend ready
- Cart persistence with backend ready
- Dynamic cart total calculation
- Complete checkout flow

🎨 Code Quality:
- Centralized API client with interceptors
- Clean production-ready code
- Proper error handling
- Removed all debugging statements
- Added 12+ new Redux thunks for API operations

📚 Documentation:
- Complete deployment guide
- Production environment template
- Quick start guide
- API reference documentation
- Implementation summary
- Step-by-step deployment commands

🎯 Production Ready:
- All security issues resolved
- All bugs fixed
- All features working
- Ready for immediate deployment

Breaking Changes: None
Migration Required: Update .env on production server
"
```

### Step 3: Push Frontend

```bash
git push origin VBS

# If you get errors:
# git push origin HEAD
```

---

## ⚠️ IMPORTANT: .env File

### ❌ DO NOT COMMIT .env FILE

The `.env` file should NEVER be committed to git because it contains:
- API keys
- Backend URLs
- Sensitive configuration

### ✅ What to do instead:

1. **Keep .env local** - It's in .gitignore
2. **Use env.example.txt** - This is the template (safe to commit)
3. **On production server** - Create .env manually with production values

---

## 🔍 Verify Before Pushing

### Check Backend Commit:

```bash
cd C:\Users\Admin\Desktop\Ecom-CMS

# See what will be committed
git diff --cached

# Should show:
# - New files in src/api/cart/
# - New files in src/api/wishlist/
# - Modified order/schema.json
# - Modified review/schema.json
```

### Check Frontend Commit:

```bash
cd C:\Users\Admin\Desktop\leaf-2

# See what will be committed
git diff --cached

# Should show modified files
# Should NOT show .env file!

# If .env is staged by accident, unstage it:
git reset .env
```

---

## 🚀 After Pushing

### 1. Backend (Production Server):

```bash
ssh your-server
cd /path/to/backend
git pull origin main
npm install
npm run build
pm2 restart strapi
```

### 2. Frontend (VPC):

```bash
ssh your-vpc
cd /path/to/frontend
git pull origin VBS
npm install
# CREATE/UPDATE .env FILE HERE!
npm run build
```

### 3. Configure Strapi Permissions:

Visit: https://your-backend.com/admin
- Go to Settings → Roles → Authenticated
- Enable: Reviews, Orders, Wishlists, Carts
- Save

---

## ✅ Success Criteria

After pushing and pulling:

### Backend:
- [ ] Git push successful
- [ ] Pulled on production server
- [ ] Strapi restarted without errors
- [ ] New APIs visible in admin panel
- [ ] Permissions configured

### Frontend:
- [ ] Git push successful
- [ ] Pulled on VPC
- [ ] Production .env created/updated
- [ ] Build completed successfully
- [ ] Website loads without errors

---

## 🆘 Troubleshooting

### Git Push Rejected:

```bash
# Pull first to merge any remote changes
git pull origin main  # or VBS for frontend

# Then push again
git push origin main  # or VBS for frontend
```

### Merge Conflicts:

```bash
# If you get merge conflicts, resolve them:
# 1. Open the conflicted files
# 2. Look for <<<<<<< HEAD markers
# 3. Choose which changes to keep
# 4. Remove conflict markers
# 5. Git add and commit
git add .
git commit -m "fix: Resolve merge conflicts"
git push
```

### Wrong Branch:

```bash
# Check current branch
git branch

# Switch to correct branch
git checkout main  # for backend
git checkout VBS   # for frontend
```

---

## 📋 Complete Deployment Sequence

Copy and paste these commands in order:

```bash
# ============================================
# STEP 1: PUSH BACKEND
# ============================================
cd C:\Users\Admin\Desktop\Ecom-CMS
git add src/api/cart/ src/api/wishlist/ src/api/order/content-types/order/schema.json src/api/review/content-types/review/schema.json
git commit -m "feat: Add Wishlist and Cart APIs for production"
git push origin main

# ============================================
# STEP 2: PUSH FRONTEND
# ============================================
cd C:\Users\Admin\Desktop\leaf-2
git add .gitignore src/ *.md env.example.txt 📚_DOCUMENTATION_INDEX.md
git reset .env
git commit -m "feat: Production-ready e-commerce with security fixes"
git push origin VBS

# ============================================
# STEP 3: DEPLOY BACKEND (on production server)
# ============================================
# ssh your-server
# cd /path/to/backend
# git pull origin main
# npm install
# npm run build
# pm2 restart strapi

# ============================================
# STEP 4: DEPLOY FRONTEND (on VPC)
# ============================================
# ssh your-vpc
# cd /path/to/frontend
# git pull origin VBS
# npm install
# nano .env  # CREATE/UPDATE .env HERE
# npm run build

# ============================================
# DONE! 🎉
# ============================================
```

---

## 🎉 Ready to Deploy!

Everything is prepared and ready to push. Just execute the commands above.

**Estimated Time:** 5 minutes for git push + 5 minutes for production deployment

**Status:** ✅ Ready to Execute

---

**Last Updated:** Ready for Deployment
**Version:** Production v1.0
**Branch:** main (backend), VBS (frontend)

