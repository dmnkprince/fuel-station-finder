# FuelFinder NG

**FuelFinder NG** is a **verified real-time fuel station tracking platform** built for Nigeria. It combines **official station manager updates** with **community verification** to provide trustworthy, up-to-date fuel availability, pricing, and queue information so drivers never have to guess which station has fuel.

This project was built as a full-stack application under the **3 Million Technical Talent (3MTT)** initiative.

---

## 🔐 User Roles & Verification System

FuelFinder NG uses a **Role-Based Access Control (RBAC)** model to ensure data accuracy:

| Role                | Permissions                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| **Admin**           | Registers new fuel stations, assigns Station Managers                                          |
| **Station Manager** | Logs in to post **official** price, availability, and queue updates for their assigned station |
| **Community User**  | Views live map, **verifies** (upvotes) or **flags** (downvotes) reported updates               |

### How It Works

1. **Admin registers stations** on the platform and assigns a Station Manager to each one.
2. **Station Managers log in** and post official updates (fuel type, price per litre, availability, queue length). These updates display an **"Official ✅"** badge.
3. **Community users** verify or flag updates. The more verifications an update receives, the more trustworthy it appears. Flagged updates alert other drivers to possible inaccuracies.
4. **The live map** shows color-coded stations reflecting the latest verified status.

---

## Key Features

- **Interactive Live Map**: Displays fuel stations across Nigeria with color-coded status circles reflecting real-time inventory.
- **Official Station Updates**: Station Managers post verified prices and availability — marked with an **Official ✅** badge.
- **Community Verification**: Upvote reports you can confirm, or flag inaccurate ones to protect other drivers.
- **Smart Time Formatting**: Displays updates using clean intervals (`Just now`, `45m`, `2h 15m`, `3d 5h`) instead of raw timestamps.
- **24-Hour Freshness Window**: Reports older than **24 hours** automatically become stale (grey) to encourage fresh updates.
- **Get Directions**: One-tap Google Maps navigation link from any station card.
- **Multi-Fuel Support**: Track Petrol (PMS), Diesel (AGO), Kerosene (DPK), and Cooking Gas (LPG).
- **Distance Awareness**: Automatically shows how far each station is from your current GPS location.
- **Rate Limiting**: Anti-spam protection on report submissions and votes.
- **JWT Authentication**: Secure token-based login for Station Managers and Admins.

---

## Status Colors

- 🟢 **In Stock**: Fuel is available with short or normal queue conditions.
- 🟡 **Queue**: Station is serving fuel, but lines are moderate to long.
- 🔴 **Out of Stock**: No fuel is currently available at the station.
- ⚪ **Stale Data**: No updates have been received in the last **24 hours**.

## Queue System (shown with 🚗)

🚗 ==> the queue is short.
🚗🚗 ==> the queue is moderate.
🚗🚗🚗 ==> the queue is long

---

## Tech Stack

### Frontend

- **Framework**: React 19 (built with Vite)
- **Mapping**: Leaflet & React-Leaflet
- **Styling**: Tailwind CSS 4
- **Icons**: FontAwesome
- **Auth**: JWT token-based with React Context

### Backend

- **Framework**: Node.js & Express
- **Database**: PostgreSQL (pg-pool client)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Security**: express-rate-limit
- **HTTP Client**: Axios

---

## Directory Structure

### Frontend (`fuel-station-finder`)

```
├── public/
│   └── img/                 # Static asset images (logos, etc.)
├── src/
│   ├── assets/              # Icons and styling imports
│   ├── components/          # Reusable React components (Map, Cards, Header, Footer, Modals)
│   ├── context/             # React Context providers (AuthContext)
│   ├── hooks/               # Custom hooks (e.g., Geolocation hook)
│   ├── pages/               # Page components (Home, About, StationDetail, AdminDashboard, ManagerDashboard)
│   ├── services/            # API communication layers (Axios connections)
│   ├── utils/               # Constants and helper formatting functions
│   ├── App.css              # Main tailwind and custom global styling rules
│   ├── App.jsx              # Routing configurations
│   └── main.jsx             # React mounting entrypoint
├── index.html               # Main index wrapper and SEO meta tags
└── package.json             # Frontend dependency configurations
```

### Backend (`fuel-station-finder-server`)

```
├── config/                  # Database connections and environments
├── controllers/             # Request handlers (Auth, Stations & Report routes)
├── database/                # Database migration schemas and seed scripts
├── middleware/              # Auth middleware (JWT), rate limiting
├── models/                  # Database entity interactions (User, Station & Report models)
├── routes/                  # Express routes mapped to controllers
├── .env                     # Local server variables and connections (ignored)
├── index.js                 # Server configurations and main entrypoint
└── package.json             # Backend dependency configurations
```

## API Endpoints

### Authentication

| Method | Endpoint             | Auth   | Description                  |
| ------ | -------------------- | ------ | ---------------------------- |
| POST   | `/api/auth/register` | Public | Create a new account         |
| POST   | `/api/auth/login`    | Public | Authenticate and receive JWT |
| GET    | `/api/auth/me`       | Bearer | Get current user profile     |

### Stations

| Method | Endpoint                           | Auth   | Description                            |
| ------ | ---------------------------------- | ------ | -------------------------------------- |
| GET    | `/api/stations`                    | Public | Fetch all stations with latest report  |
| GET    | `/api/stations/:id`                | Public | Fetch station with full report history |
| POST   | `/api/stations`                    | Admin  | Register a new fuel station            |
| PATCH  | `/api/stations/:id/assign-manager` | Admin  | Assign a Station Manager               |

### Reports

| Method | Endpoint                    | Auth     | Description                        |
| ------ | --------------------------- | -------- | ---------------------------------- |
| POST   | `/api/reports`              | Public\* | Submit a price/availability report |
| PATCH  | `/api/reports/:id/upvote`   | Public   | Verify/upvote a report             |
| PATCH  | `/api/reports/:id/downvote` | Public   | Flag a report as inaccurate        |

> \*Reports submitted by authenticated Station Managers for their assigned station are automatically marked as **Official**.

---

## 🌎 Deployment

- Both front end and Back end were deployed using Render
- 1. https://fuel-station-finder.onrender.com (Front end deployed as a Static website)
- 2. https://fuel-station-api-if7v.onrender.com (Backend API deployed as a web service)
