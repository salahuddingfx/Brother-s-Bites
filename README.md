# Brother's Bites — Digital Business Portal

A full-stack web application for Brother's Bites, featuring a public-facing website with a dynamic menu and an admin dashboard for managing menu items, categories, and site settings.

## Project Structure

```
brothers-bites/
├── client/           # Next.js frontend + admin dashboard
├── server/           # Node.js + Express REST API
├── .gitignore
└── README.md
```

- **`client/`** — Next.js application serving both the public site (`/`) and the admin dashboard (`/admin`). Handles routing, UI components, and API consumption.
- **`server/`** — Express.js API server managing authentication, CRUD operations, image uploads, and database interactions.

## Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | Next.js 14, React, TypeScript, Tailwind CSS   |
| Backend     | Node.js, Express.js, TypeScript               |
| Database    | MongoDB (Atlas)                                |
| Auth        | JWT (JSON Web Tokens)                          |
| Storage     | Cloudinary (image uploads)                     |
| Deployment  | Vercel (frontend), Node.js hosting (backend)   |

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & Install

```bash
cd brothers-bites
cd client && npm install
cd ../server && npm install
```

### 2. Environment Variables

**Server `.env`:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-atlas-connection-string
AUTH_SECRET=your-jwt-secret-min-32-chars
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Client `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:

- Default admin: `admin@brothersbites.com` / `admin123`
- Default categories
- Sample menu items
- Default settings

### 4. Start Development

Terminal 1 — API server:

```bash
cd server
npm run dev
```

Terminal 2 — Frontend:

```bash
cd client
npm run dev
```

### 5. Access

- **Public:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

## MongoDB Setup

1. Create a MongoDB Atlas cluster (free tier works).
2. Create a database user with read/write access.
3. Whitelist your IP address (use `0.0.0.0/0` for development).
4. Get the connection string from the Atlas dashboard.
5. Replace the `MONGODB_URI` value in your server `.env`.

## Cloudinary Setup

1. Create a free Cloudinary account.
2. From the dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Add them to the server `.env` file.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub.
2. Connect the repository to Vercel.
3. Set the **root directory** to `client`.
4. Add the following environment variables in Vercel:

   | Variable                | Value                                                  |
   |-------------------------|--------------------------------------------------------|
   | `NEXT_PUBLIC_API_URL`   | `https://api.brothers-bites.salahuddin.codes/api/v1`   |
   | `NEXT_PUBLIC_SITE_URL`  | `https://brothers-bites.salahuddin.codes`              |

5. Deploy.

### Backend (Node.js Hosting)

1. Push to GitHub (same or separate repo).
2. Deploy to a Node.js-compatible host (Render, Railway, Fly.io, etc.).
3. Set the environment variables (same as the server `.env`).
4. Build command: `npm run build`
5. Start command: `npm start`

### Backend (VPS — Future)

```bash
# On VPS
git clone <repo-url>
cd brothers-bites/server
npm install
npm run build
npm install -g pm2
pm2 start dist/app.js --name brothers-bites-api
pm2 save
pm2 startup
```

**Nginx config:**

```nginx
server {
    listen 443 ssl;
    server_name api.brothers-bites.salahuddin.codes;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Custom Domain Setup

1. **Vercel** — Add `brothers-bites.salahuddin.codes` as a custom domain.
2. **DNS** — Add a CNAME record pointing to Vercel's target.
3. **API subdomain** — Point `api.brothers-bites.salahuddin.codes` to your Node server's IP.
4. **SSL** — Auto-provisioned by Vercel and most hosting providers.

## Admin Credentials

| Field    | Value                        |
|----------|------------------------------|
| Email    | `admin@brothersbites.com`    |
| Password | `admin123`                   |

**Change this after your first login** via the Settings page in the admin dashboard.

## QR Code

Point QR codes to:

```
https://brothers-bites.salahuddin.codes/menu
```

This ensures dynamic content (prices, items) always stays current — no need to regenerate QR codes when the menu changes.

## Production Checklist

- [ ] Change admin password
- [ ] Set real MongoDB Atlas connection string
- [ ] Configure Cloudinary credentials
- [ ] Set production environment variables
- [ ] Test all API endpoints
- [ ] Test admin login
- [ ] Test menu CRUD operations
- [ ] Test image uploads
- [ ] Verify responsive design
- [ ] Check SEO metadata
- [ ] Verify HTTPS is active
- [ ] Test on mobile devices
- [ ] Set up monitoring / uptime checks
