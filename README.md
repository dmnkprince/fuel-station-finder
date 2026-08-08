# FuelFinder NG 

**FuelFinder NG** is a crowdsourced real-time fuel station availability, price, and queue tracker designed specifically for Nigeria. It empowers commuters to share and verify live updates at stations, helping drivers find available fuel, check current prices per litre, and avoid long lines.

This project was built as a full-stack application under the **3 Million Technical Talent (3MTT)** initiative.

---

##  Key Features

- **Interactive Live Map**: Displays fuel stations across Nigeria with color-coded status circles reflecting real-time inventory.
- **Crowdsourced Price & Availability Reports**: Community members submit current prices (Petrol, Diesel, Kerosene, Cooking Gas) and queue lengths.
- **Verification System**: Endorse other users' updates with a quick upvote to establish trustworthiness.
- **Smart Time Formatting**: Displays updates using clean intervals (`Just now`, `45m`, `2h 15m`, `3d 5h`) instead of raw minutes.
- **Extended Freshness window**: Custom status updates (In Stock, No Stock, Queueing) stay active for up to **2 weeks** before turning stale (grey).
- **Mobile-Responsive Footer**: Compact, fully functional footer featuring a dedicated About page and easy contact options via WhatsApp, GitHub, and LinkedIn.

---

##  How it Works (Status Colors)

- 🟢 **In Stock**: Fuel is available with short or normal queue conditions.
- 🟡 **Queue**: Station is serving fuel, but lines are moderate to long.
- 🔴 **Out of Stock**: No fuel is currently available at the station.
- ⚪ **Stale Data**: No community updates have been received in the last **2 weeks**.


##  The queue system is further shown by using 🚗
   🚗          ==> the queue is short.
   🚗🚗        ==> the queue is moderate.
   🚗🚗🚗     ==> the queue is long


## Tech Stack

### Frontend
- **Framework**: React 19 (built with Vite)
- **Mapping**: Leaflet & React-Leaflet
- **Styling**: Tailwind CSS 4
- **Icons**: FontAwesome

### Backend
- **Framework**: Node.js & Express
- **Database**: PostgreSQL (pg-pool client)
- **HTTP Client**: Axios

---

## Directory Structure

### Frontend (`fuel-station-finder`)
```
├── public/
│   └── img/                 # Static asset images (logos, etc.)
├── src/
│   ├── assets/              # Icons and styling imports
│   ├── components/          # Reusable React components (Map, Cards, Header, Footer)
│   ├── hooks/               # Custom hooks (e.g., Geolocation hook)
│   ├── pages/               # Page components (Home view, About page, Station Details)
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
├── controllers/             # Request handlers (Stations & Report routes)
├── database/                # Database migration schemas
├── models/                  # Database entity interactions (Station & Report models)
├── routes/                  # Express routes mapped to controllers
├── .env                     # Local server variables and connections (ignored)
├── index.js                 # Server configurations and main entrypoint
└── package.json             # Backend dependency configurations
```


## 🌎 Deployment
- Both front end and Back end were deplyed using Render 
- 1. https://fuel-station-finder.onrender.com (Front end and Deplyed as a Static site)
- 2. https://fuel-station-api-if7v.onrender.com  (Backend API deployed as a web service)
