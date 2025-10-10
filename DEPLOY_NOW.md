# 🚀 DEPLOY NOW - Quick Commands

## ⚡ Deploy Your E-Commerce Site in 10 Minutes

---

## Step 1: Push Backend to Git (2 minutes)

```bash
cd C:\Users\Admin\Desktop\Ecom-CMS

# Check what will be pushed
git status

# Add new APIs
git add src/api/wishlist/
git add src/api/cart/
git add src/api/review/content-types/review/schema.json
git add src/api/order/content-types/order/schema.json

# Commit
git commit -m "feat: Add Wishlist and Cart APIs for production deployment"

# Push to remote
git push origin main
```

---

## Step 2: Push Frontend to Git (2 minutes)

```bash
cd C:\Users\Admin\Desktop\leaf-2

# Check changes
git status

# Add all changes
git add .

# Commit
git commit -m "feat: Production-ready e-commerce with security fixes"

# Push to remote
git push origin main
```

---

## Step 3: Pull Backend on Production Server (2 minutes)

```bash
# SSH to your production server
ssh your-server

# Navigate to backend
cd /path/to/backend

# Pull changes
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart
pm2 restart strapi
# OR
npm run start
```

---

## Step 4: Configure Backend Permissions (1 minute)

1. Open: `https://your-backend.com/admin`
2. Go to: **Settings → Roles → Authenticated**
3. Enable for **Reviews, Orders, Wishlists, Carts**
4. Click **Save**

---

## Step 5: Pull Frontend on VPC (2 minutes)

```bash
# SSH to your VPC
ssh your-vpc

# Navigate to frontend
cd /path/to/frontend

# Pull changes
git pull origin main

# Install dependencies
npm install

# Build for production
npm run build

# Dist folder is ready!
```

---

## Step 6: Update Production .env (1 minute)

On your VPC, create/update `.env`:

```bash
cd /path/to/frontend

# Edit .env file
nano .env
```

Add this content:

```env
VITE_API_BASE_URL=https://your-backend.com/api
VITE_Image_BASE_URL=https://your-backend.com
VITE_STRIPE_PUBLISHABLE_KEY=your_new_production_key
VITE_RAPIDSHYP_TOKEN=your_new_token
VITE_OTP_SERVICE_URL=https://your-otp-service.com
VITE_PAYMENT_SERVICE_URL=https://your-payment-service.com
VITE_ENV=production
```

Save and rebuild:

```bash
npm run build
```

---

## Step 7: Test Everything (2 minutes)

Visit your website and test:

✅ Browse products
✅ Add to cart (check total)
✅ Login/Signup
✅ Checkout flow
✅ Submit review

---

## 🎉 Done! Your Site is LIVE!

---

## 📋 Quick Troubleshooting

### Backend Issues:

```bash
# Check logs
pm2 logs strapi

# Restart
pm2 restart strapi

# Clear cache
cd backend && rm -rf .cache && npm run build
```

### Frontend Issues:

```bash
# Rebuild
npm run build

# Check nginx
sudo nginx -t
sudo systemctl restart nginx
```

### CORS Issues:

Edit `backend/config/middlewares.js`:

```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://your-frontend.com'],
    credentials: true,
  },
}
```

---

## ⚠️ CRITICAL: Before Going Live

1. **Rotate API Keys:**
   - Get NEW Stripe key
   - Get NEW RapidShyp token
   - Update .env

2. **Check URLs:**
   - Backend URL in frontend .env
   - Frontend URL in backend CORS
   - Image URL is correct

3. **Test Payment:**
   - Use Stripe test mode first
   - Test with test cards
   - Switch to live mode when ready

---

## 🔍 Verify Deployment

```bash
# Test backend API
curl https://your-backend.com/api/products

# Test frontend
curl https://your-frontend.com

# Check SSL
curl -I https://your-frontend.com
```

---

## 📞 Emergency Contacts

- **Hosting Support:** [Your hosting provider]
- **Stripe Support:** https://support.stripe.com
- **RapidShyp Support:** https://rapidshyp.com/contact

---

## ✅ Post-Deployment Checklist

- [ ] Backend pushed and deployed
- [ ] Frontend pushed and deployed
- [ ] Environment variables updated
- [ ] API permissions configured
- [ ] CORS configured correctly
- [ ] SSL certificate active
- [ ] Test orders working
- [ ] Payment gateway tested
- [ ] Mobile responsive verified
- [ ] Error monitoring active

---

**Your E-Commerce Site is READY TO GO! 🎉**

**Start Time:** Now
**Deploy Time:** 10 minutes
**Status:** ✅ Production Ready

---

## 🚀 What's New in This Deployment

### Backend:
✨ Wishlist API - Save favorite products
✨ Cart API - Persistent shopping cart
🔧 Enhanced Reviews - With product relations
🔧 Enhanced Orders - With full tracking

### Frontend:
🔐 Security fixes - No exposed keys
🐛 Bug fixes - Cart totals, password reset
⚡ Performance - Clean code, no console.logs
✨ Full functionality - Reviews, orders, wishlist

---

**Last Updated:** Ready for Immediate Deployment
**Version:** Production v1.0
**Status:** 🟢 GO FOR LAUNCH

