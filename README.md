# Online Appointment Booking System

Full-stack MERN starter project using React for the frontend, Express for the backend, and MongoDB for persistent storage with separate frontend pages/components/services and separate backend routes/controllers/services/data.

## Features

- Customer login and admin login
- Admin approval flow for booked appointments
- Separate pages for landing, auth, services, booking, and dashboard
- Smart recommendations and colored slot calendar
- Emergency booking and priority booking
- Mandatory cancellation reason and rescheduling
- Direct slot booking without a payment step
- Notifications through registered email and mobile number, with no notification log shown on the dashboard
- Multiple services with specialists: doctor, salon, mechanic, pediatric care, home repair and video follow-up
- Responsive UI for laptop and mobile
- Frontend split into `components`, `pages`, `services`
- Backend split into `routes`, `controllers`, `services`, `data`, `db`

## Demo Logins

- Customer: `customer@example.com` / `customer123`
- Admin: `admin@example.com` / `admin123`

## MongoDB Setup

1. Install MongoDB Community Server and make sure the MongoDB service is running.
2. Copy the sample environment file:

```powershell
Copy-Item server\.env.example server\.env
```

3. Update `server/.env` if your MongoDB URL or database name are different.
4. Add notification credentials in `server/.env` if you want real email or SMS delivery.
   Recommended quick setup: Gmail SMTP with an App Password.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM=yourgmail@gmail.com
SMS_API_URL=
SMS_API_KEY=
SMS_SENDER_ID=BOOKIT
```

Gmail setup:

1. Turn on 2-Step Verification in your Google account.
2. Open Google Account -> Security -> App passwords.
3. Create an app password for Mail.
4. Paste that 16-character app password into `SMTP_PASS`.
5. Keep `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_SECURE=false`.

## Run In VS Code

Open the integrated terminal in the project root and run:

```powershell
npm run install:all
npm run db:init
npm run dev
```

If `npm run install:all` fails, run these separately:

```powershell
npm install
npm install --prefix server
npm install --prefix client
```

## Frontend

- URL: `http://localhost:5173`
- Pages:
  - `/` landing page
  - `/auth` login / signup
  - `/services` service listing
  - `/booking` appointment booking flow
  - `/dashboard` customer or admin dashboard

## Render Deployment

If you deploy frontend and backend separately on Render, set this frontend environment variable in the Render dashboard:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
```

If frontend and backend are served from the same domain, the app will automatically use `/api`.

This repo now includes a Render blueprint in [render.yaml](C:\Users\neera\Downloads\project\render.yaml).

Recommended Render setup:

1. Push this project to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select your GitHub repository.
4. Render will create:
   - `appointment-booking-api` for Express
   - `appointment-booking-client` for React
5. In the backend service, add your real environment values:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=appointment_booking
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM=yourgmail@gmail.com
```

6. Redeploy both services after saving env vars.

Backend health check:

```text
/api/health
```

## Backend

- URL: `http://localhost:4000`

## Backend Notes

- MongoDB connection config is stored in [server/.env.example](C:\Users\neera\Downloads\project\server\.env.example)
- SMTP and SMS settings can be added in [server/.env.example](C:\Users\neera\Downloads\project\server\.env.example) / `server/.env` for live notification delivery
- Seed script is in [server/scripts/initDb.js](C:\Users\neera\Downloads\project\server\scripts\initDb.js)
- Seed data is in [server/data/seedData.js](C:\Users\neera\Downloads\project\server\data\seedData.js)
- API routes are split under [server/routes](C:\Users\neera\Downloads\project\server\routes\authRoutes.js)
- Root database init command is `npm run db:init`
