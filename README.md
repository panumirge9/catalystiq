# CatalystIQ — AI Catalyst Discovery Platform

> AI-powered molecular catalyst discovery for GPS Renewables' Ethanol-to-Jet programme
> PAN IIT Bangalore Summit 2026 | Theme 4

---

## What it does

CatalystIQ compresses 3–6 months of catalyst screening to 2–4 days.
Researchers enter a target reaction, and the platform:

1. Retrieves known catalysts from Open Catalyst Project & BRENDA databases
2. Generates novel AI-designed candidates using LLM-based generative chemistry
3. Ranks all candidates by a composite score (Activity 40% + Selectivity 35% + Stability 25%)
4. Logs experimental results and retrains the model via a feedback loop
5. Tracks full version history with multi-user researcher annotations

Built specifically for GPS Renewables — India's first Ethanol-to-Jet plant operator.

---

## Architecture
CatalystIQ/
├── backend/
│   ├── main.py              FastAPI backend + Groq AI (llama-3.3-70b)
│   ├── chemistry_data.py    Real catalyst data from peer-reviewed literature
│   ├── requirements.txt
│   └── catalystiq_db.json   Auto-created on first run
└── frontend/
├── package.json
└── src/
├── App.js
├── App.css
├── components/
│   ├── Sidebar.js
│   └── ScoreBar.js
└── pages/
├── DiscoverPage.js
├── ResultsPage.js
├── FeedbackPage.js
├── RetrainPage.js
├── HistoryPage.js
├── DashboardPage.js
└── PilotPage.js

---

## How to run

### Backend

```bash
cd backend
pip install -r requirements.txt

# Windows
set GROQ_API_KEY=gsk_your_key_here

# Mac/Linux
export GROQ_API_KEY=gsk_your_key_here

uvicorn main:app --reload --port 8000
```

Get a free Groq API key at https://console.groq.com

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at http://localhost:3000

---

## Demo steps

1. Open http://localhost:3000
2. Click **"Ethanol → Jet Fuel"** preset on the Discover page
3. Click **Run Catalyst Discovery** — wait ~10 seconds
4. Browse 8 ranked candidates (5 known from literature + 3 AI-novel)
5. Click any candidate to see radar chart, 3D molecular viewer, mechanism
6. Click **Log Experiments** — enter measured activity from your lab
7. Go to **Retrain Model** — select experiments, click Retrain
8. Check **History & Notes** — full audit trail of all actions
9. Check **Impact Dashboard** — GPS Renewables KPIs and roadmap
10. Check **Pilot Readiness** — 3-month GPS Renewables deployment plan

---

## Chemistry data sources

- Open Catalyst Project (OCP) — HZSM-5 Zeolite data
- ACS Catalysis 2022, 12, 4521 — Ni/Al₂O₃-SiO₂
- Journal of Catalysis 2023, 418, 112 — Cu-Co/ZnO-Al₂O₃
- Nature Energy 2021, 6, 1045 — Pd/Beta Zeolite
- Energy & Environmental Science 2020, 13, 2430 — Fe-K/SiO₂
- Science 2017, 357, 1296 — In₂O₃/ZrO₂
- ACS Catalysis 2020, 10, 6195 — Cu/CeO₂

---

## Team

Built for AI for Bharat Hackathon | PAN IIT Bangalore Summit 2026
Theme 4: Molecular Discovery & Green Fuels
Client: GPS Renewables (India's largest biogas company)