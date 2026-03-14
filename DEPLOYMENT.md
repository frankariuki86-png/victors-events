# Victor's Events — Deployment Guide

This guide covers deploying the frontend to **Vercel** and the backend to **Render**, both free tiers.

---

## ⚠️ Security Note Before You Deploy

Your `backend/.env.example` currently contains **real Supabase keys**.  
Before pushing to GitHub:
1. Remove the real values from `.env.example` and replace with placeholders like `your_value_here`.
2. Ensure `.env` is in `.gitignore` (it already is — keep it that way).
3. Never commit real credentials to a public repository.

---

## Prerequisites

- Node.js 18+
- A GitHub account (push your project to a GitHub repo)
- A [Supabase](https://supabase.com) project (already set up)
- A [Vercel](https://vercel.com) account (free)
- A [Render](https://render.com) account (free)

---

## Part 1 — Deploy the Backend to Render

### 1. Push your project to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/victors-events.git
git push -u origin main
```

### 2. Create a Web Service on Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Set these build settings:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

### 3. Set Environment Variables on Render

In Render dashboard → your service → **Environment** → add each variable:

```
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app

JWT_SECRET=use_a_long_random_string_at_least_32_chars

SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key
SUPABASE_ANON_KEY=eyJ...your_anon_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

MPESA_ENV=production
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-render-api.onrender.com/api/payments/mpesa/callback
MPESA_PARTYB=your_shortcode
```

> **Tip:** Generate a strong JWT_SECRET with:  
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### 4. Deploy

Click **Deploy**. Render will install dependencies and start the backend.  
Your API will be live at: `https://your-service-name.onrender.com`

---

## Part 2 — Deploy the Frontend to Vercel

### 1. Create a Vercel Project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite — leave framework as **Vite**

### 2. Set Environment Variables on Vercel

In Vercel → project → **Settings** → **Environment Variables**:

```
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps?q=Nakuru%2C%20Kenya&output=embed
```

> Replace `your-render-api.onrender.com` with your actual Render URL.

### 3. Deploy

Click **Deploy**. Vercel builds the React app.  
Your site will be live at: `https://your-project.vercel.app`

---

## Part 3 — Update Backend CORS

Once Vercel gives you the live URL, go back to Render and update:

```
FRONTEND_URL=https://your-project.vercel.app
```

Then redeploy the backend (Render redeployment is one click).

---

## Part 4 — M-Pesa Callback (Production Only)

For live M-Pesa payments, Safaricom requires a **public HTTPS URL** for the callback.  
Your Render backend URL is already HTTPS — use:

```
MPESA_CALLBACK_URL=https://your-render-api.onrender.com/api/payments/mpesa/callback
```

Register this URL in your [Safaricom Daraja portal](https://developer.safaricom.co.ke) under your app's API settings.  
Switch `MPESA_ENV=production` in Render environment variables.

---

## Part 5 — Custom Domain (Optional)

### Vercel (Frontend)
1. Vercel → Project → **Domains** → Add your domain (e.g. `victorsevents.co.ke`)
2. Add the DNS records shown by Vercel to your domain registrar

### Render (Backend)
1. Render → Service → **Settings** → **Custom Domain**
2. Add a subdomain like `api.victorsevents.co.ke`
3. Update `VITE_API_URL` on Vercel and `FRONTEND_URL` on Render accordingly

---

## Part 6 — Supabase Production Checklist

- [ ] Row Level Security (RLS) is enabled on all tables ✅ (already in schema)
- [ ] Service Role Key is only used in backend env (never in frontend)
- [ ] Anon Key is only used in backend auth client (already the case)
- [ ] Admin user is inserted in `admin_users` table
- [ ] Email confirmation is disabled in Supabase Auth (for admin-only login flow)

To disable email confirmation:  
Supabase → **Authentication** → **Providers** → **Email** → uncheck "Confirm email"

---

## Quick Reference: URLs After Deployment

| Service | URL Example |
|---|---|
| Frontend | `https://victors-events.vercel.app` |
| Backend API | `https://victors-events-api.onrender.com` |
| Admin Login | `https://victors-events.vercel.app/admin` |
| M-Pesa Callback | `https://victors-events-api.onrender.com/api/payments/mpesa/callback` |

---

## Running Locally (Dev)

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env      # Fill in real values
npm install
npm run dev               # Starts on http://localhost:4000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env      # Set VITE_API_URL=http://localhost:4000/api
npm install
npm run dev               # Starts on http://localhost:5173
```
