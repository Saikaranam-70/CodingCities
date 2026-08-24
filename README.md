# 🏙️ LeetCode City — 3D Stats Visualization App

**LeetCode City** is a full-stack web application that visualizes LeetCode user statistics as an interactive 3D isometric city — inspired by "GitHub City" style visualizations. Buildings represent solved problems, districts represent topic/skill categories, city density reflects submission calendar activity, streak count drives eco-sustainability flourishes (windmills & solar panels), and contest rating powers a landmark skyscraper.

---

## 🚀 Key Architectural Advantage: Self-Hosted / Local Stats API

Unlike apps that rely on shared public API instances (which suffer from rate limits like `429 Too Many Requests`), **LeetCode City** includes its own local clone of [`alfa-leetcode-api`](https://github.com/alfaarghya/alfa-leetcode-api.git) located in `/stats-api`.

You have **100% full control** over your stats service locally and in production.

```
┌─────────────────┐        ┌───────────────────┐        ┌────────────────────────┐
│    Frontend     │  --->  │  Render/Local:    │  --->  │  Local / Render:       │
│  (Vite + React  │        │  backend (Express │        │  stats-api             │
│   R3F 3D Canvas)│  <---  │  + Redis client)  │  <---  │  (alfa-leetcode-api)   │
└─────────────────┘        └───────────────────┘        └────────────────────────┘
                                     │
                                     v
                            ┌─────────────────┐
                            │ Redis (Render   │
                            │ add-on/Upstash) │
                            └─────────────────┘
```

---

## 📂 Project Structure

- `/stats-api`: Cloned clone of `alfa-leetcode-api` (runs on `http://localhost:3000`). Gives full control over LeetCode GraphQL fetchers without external rate limits.
- `/backend`: Node.js + Express + TypeScript API (runs on `http://localhost:5000`). Reshapes raw LeetCode data into the 3D `CityScene` contract and handles Redis caching.
- `/frontend`: React + React Three Fiber + Three.js + TypeScript + Tailwind CSS SPA (runs on `http://localhost:5173`).

---

## ⚙️ Local Development Quickstart

Run all three services locally for instant iteration:

### 1. Stats API Service (`/stats-api`)
```bash
cd stats-api
npm run dev
# Starts on http://localhost:3000
```

### 2. Backend Express API (`/backend`)
```bash
cd backend
npm run dev
# Starts on http://localhost:5000 (Targeting http://localhost:3000)
```
> Probe log: `✅ [HealthCheck] Stats API responded successfully.`

### 3. Frontend App (`/frontend`)
```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)

| Variable | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | Port for Express backend |
| `STATS_API_URL` | **Yes** | `http://localhost:3000` | Base URL of local or deployed `stats-api` |
| `REDIS_URL` | No | *(Unset)* | Redis store URL (uses high-speed memory fallback if unset) |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS allowed origin |

### Frontend (`/frontend/.env`)

| Variable | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | No | `http://localhost:5000` | Target Express backend URL |

---

## 🎨 Stat-to-Visual Mapping Reference

See [`MAPPING.md`](file:///c:/Users/KARANAM%20SAI/Desktop/Leetcode%20City/MAPPING.md) for detailed mathematical logic.

- **Building Height:** Logarithmic scaling formula $\text{Height} = \text{clamp}(1.2 + 2.5 \times \ln(1 + \text{solvedCount}), 1.0, 12.0)$.
- **Building Color:** Easy (Emerald `#10B981`), Medium (Amber `#F59E0B`), Hard (Crimson `#EF4444`).
- **Districts:** Topic tags sorted by problem count, laid out on an expanding 2D square spiral.
- **Streak Motif:** Active problem streaks power animated 3D Windmills & Solar Panel arrays.
- **Coastal Flora:** 365-day submission activity populates coastal trees around island.
- **Landmark Tower:** High-rise skyscraper at city center scaled by LeetCode contest rating.
