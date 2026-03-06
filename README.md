# 🍼 Baby Planner — Denver, CO

A full-stack web app to plan and track everything for your new baby, personalized for **Berkeley / Highlands, Denver CO** (near 3280 W Hayward Pl). Baby due **September 2026**.

---

## Features

| Module | What it does |
|--------|-------------|
| **Dashboard** | Countdown to due date, cost overview, action checklist |
| **Immunizations** | Full CDC 2024 vaccine schedule (birth → 18 yrs) with checkboxes |
| **Schools & Daycares** | 15 real Denver-area schools with ratings, costs, waitlists, distance |
| **College Savings** | Interactive 529 calculator with growth chart, CO tax benefit info |

---

## Tech Stack

- **Backend:** Python · FastAPI · SQLite (SQLAlchemy ORM)
- **Frontend:** React 18 · Vite · Tailwind CSS · Recharts
- **Database:** SQLite (file-based, no setup needed)

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/baby-planner.git
cd baby-planner
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
API docs (auto-generated) at `http://localhost:8000/docs`.
The SQLite database is auto-created and seeded on first run.

### 3. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## Project Structure

```
baby-planner/
├── backend/
│   ├── main.py                  # FastAPI app + CORS + startup seeding
│   ├── database.py              # SQLAlchemy engine & session factory
│   ├── models.py                # ORM table definitions
│   ├── schemas.py               # Pydantic request/response models
│   ├── seed.py                  # Populates DB with Denver data on first run
│   ├── requirements.txt
│   ├── routers/
│   │   ├── immunizations.py     # CDC vaccine schedule CRUD
│   │   ├── schools.py           # Schools & daycares CRUD
│   │   └── savings.py           # 529 calculator + goals
│   └── data/
│       ├── seed_immunizations.py  # 35 CDC vaccines birth → 18 years
│       ├── seed_schools.py        # 15 Denver schools/daycares w/ data
│       └── seed_savings.py        # Colorado CollegeInvest 529 starter goal
└── frontend/
    ├── src/
    │   ├── App.jsx              # Router + navigation shell
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Countdown, cost table, action checklist
    │   │   ├── Immunizations.jsx # Grouped/filterable CDC vaccine checklist
    │   │   ├── Schools.jsx      # School cards with favorites & filters
    │   │   └── Savings.jsx      # Interactive 529 growth calculator + chart
    │   └── api/client.js        # Axios instance (proxies to :8000)
    ├── index.html
    ├── vite.config.js           # Dev proxy: /api → localhost:8000
    └── tailwind.config.js
```

---

## Pushing to GitHub

1. Create a new **empty** repository on [github.com](https://github.com/new) named `baby-planner`
2. In the project folder, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/baby-planner.git
git add .
git commit -m "Initial baby planner app"
git push -u origin main
```

---

## Denver-Specific Notes

- **Daycare waitlists** in Berkeley/Highlands average 3–6 months — sign up now
- **Denver Language School lottery**: apply each January for the following September kindergarten year
- **DPS open enrollment**: typically January–February at [enrolldps.dpsk12.org](https://enrolldps.dpsk12.org)
- **Colorado 529**: open at [collegeinvest.org](https://www.collegeinvest.org) — CO residents deduct up to $20k/year (joint filers) from state taxes
- **CCCAP**: Colorado Child Care Assistance Program available for income-qualifying families

---

*Built with love for your September 2026 arrival 🎉*
