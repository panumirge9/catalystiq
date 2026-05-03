"""
CatalystIQ — AI Catalyst Discovery Platform
GPS Renewables | PAN IIT Bangalore Summit 2026 | Theme 4
Author: Pranav Mirage
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from pathlib import Path
from datetime import datetime
from chemistry_data import get_context_for_reaction
import json
import re
import uuid
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


app = FastAPI(
    title="CatalystIQ API",
    description="AI-powered catalyst discovery for GPS Renewables ETJ programme",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])

DB_FILE = Path("catalystiq_db.json")


def load_db():
    if DB_FILE.exists():
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                return (
                    data.get("experiment_results", []),
                    data.get("audit_trail", []),
                    data.get("researcher_notes", [])
                )
        except Exception:
            pass
    return [], [], []


def save_db():
    with open(DB_FILE, "w") as f:
        json.dump({
            "experiment_results": experiment_results,
            "audit_trail": audit_trail,
            "researcher_notes": researcher_notes,
            "saved_at": datetime.utcnow().isoformat()
        }, f, indent=2)


experiment_results, audit_trail, researcher_notes = load_db()


class ReactionQuery(BaseModel):
    reaction: str
    temperature: Optional[str] = "300-400°C"
    pressure: Optional[str] = "1-50 bar"
    constraints: Optional[str] = ""


class ExperimentFeedback(BaseModel):
    candidate_id: str
    candidate_name: str
    predicted_activity: float
    measured_activity: float
    measured_selectivity: float
    notes: Optional[str] = ""


class RetrainRequest(BaseModel):
    feedback_ids: List[str]


class ResearcherAnnotation(BaseModel):
    experiment_id: str
    author: str
    observation: str
    follow_up: Optional[str] = ""


def extract_json(text: str):
    match = re.search(r"```json\s*([\s\S]*?)```", text)
    if match:
        return json.loads(match.group(1))
    match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if match:
        return json.loads(match.group(1))
    raise ValueError("No JSON found in AI response")


def query_groq(prompt: str) -> str:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2500
    )
    return response.choices[0].message.content


def compute_composite_score(activity: float, selectivity: float, stability: float) -> float:
    return round(0.4 * activity + 0.35 * selectivity + 0.25 * stability, 3)


def log_event(event_type: str, description: str, author: str = "System"):
    audit_trail.append({
        "id": str(uuid.uuid4()),
        "type": event_type,
        "author": author,
        "description": description,
        "created_at": datetime.utcnow().isoformat()
    })


@app.get("/")
def root():
    return {"status": "CatalystIQ API running", "version": "1.0.0"}


@app.post("/api/discover")
async def discover_catalysts(query: ReactionQuery):
    chemistry_context = get_context_for_reaction(query.reaction)

    prompt = f"""You are an expert computational chemist specialising in heterogeneous catalysis and sustainable fuels. You are advising GPS Renewables — India's largest biogas company — which is building the country's first Ethanol-to-Jet (ETJ) plant.

Target reaction from researcher:
Reaction: {query.reaction}
Temperature range: {query.temperature}
Pressure range: {query.pressure}
Constraints: {query.constraints or "None specified"}

{chemistry_context}

Instructions:
1. Return 4-5 KNOWN catalysts using the real data provided above. Do not invent names.
2. Propose 3 NOVEL candidates based on the design seeds, with specific structural modifications and quantitative improvement estimates.
3. Rank all by composite performance.

Respond ONLY with valid JSON, no explanation outside it:
{{
  "reaction_summary": "one sentence describing the specific reaction chemistry",
  "known_catalysts": [
    {{
      "id": "known_1",
      "name": "exact catalyst name from literature",
      "formula": "exact chemical formula",
      "type": "Known",
      "source": "exact paper or database reference",
      "predicted_activity": 0.0,
      "predicted_selectivity": 0.0,
      "predicted_stability": 0.0,
      "temperature_range": "actual operating range",
      "key_properties": ["property 1", "property 2"],
      "mechanism": "specific mechanistic description",
      "rank": 1
    }}
  ],
  "novel_candidates": [
    {{
      "id": "novel_1",
      "name": "specific novel catalyst name",
      "formula": "specific chemical formula",
      "type": "Novel",
      "source": "CatalystIQ Generative Design",
      "predicted_activity": 0.0,
      "predicted_selectivity": 0.0,
      "predicted_stability": 0.0,
      "temperature_range": "predicted operating range",
      "key_properties": ["property 1", "property 2"],
      "design_rationale": "specific modification with quantitative improvement estimate",
      "mechanism": "specific mechanistic description",
      "rank": 1
    }}
  ],
  "top_recommendation": "id of top candidate",
  "reaction_energy_profile": {{
    "activation_energy_kJ_mol": 0.0,
    "reaction_enthalpy_kJ_mol": 0.0,
    "estimated_conversion_percent": 0.0
  }}
}}"""

    raw = query_groq(prompt)
    data = extract_json(raw)

    all_candidates = []
    for c in data.get("known_catalysts", []):
        c["uuid"] = str(uuid.uuid4())
        all_candidates.append(c)
    for c in data.get("novel_candidates", []):
        c["uuid"] = str(uuid.uuid4())
        all_candidates.append(c)

    for c in all_candidates:
        c["composite_score"] = compute_composite_score(
            c["predicted_activity"],
            c["predicted_selectivity"],
            c["predicted_stability"]
        )

    all_candidates.sort(key=lambda x: x["composite_score"], reverse=True)
    for i, c in enumerate(all_candidates):
        c["rank"] = i + 1

    log_event("discovery", f"Discovery run: {query.reaction} — {len(all_candidates)} candidates ranked")
    save_db()

    return {
        "query": query.dict(),
        "reaction_summary": data.get("reaction_summary", ""),
        "candidates": all_candidates,
        "top_recommendation": data.get("top_recommendation", ""),
        "reaction_energy_profile": data.get("reaction_energy_profile", {}),
        "generated_at": datetime.utcnow().isoformat()
    }


@app.post("/api/feedback")
async def log_feedback(feedback: ExperimentFeedback):
    discrepancy = round(abs(feedback.predicted_activity - feedback.measured_activity), 3)

    if feedback.measured_activity > feedback.predicted_activity + 0.05:
        performance_status = "exceeded"
    elif feedback.measured_activity < feedback.predicted_activity - 0.05:
        performance_status = "underperformed"
    else:
        performance_status = "matched"

    entry = {
        **feedback.dict(),
        "id": str(uuid.uuid4()),
        "logged_at": datetime.utcnow().isoformat(),
        "discrepancy": discrepancy,
        "status": performance_status
    }
    experiment_results.append(entry)

    log_event(
        "experiment",
        f"Experiment logged: {feedback.candidate_name} — measured {feedback.measured_activity:.2f} vs predicted {feedback.predicted_activity:.2f}",
        author="Lab Researcher"
    )
    save_db()

    return {"success": True, "entry": entry}


@app.get("/api/feedback")
def get_feedback():
    return {"feedback": experiment_results, "count": len(experiment_results)}


@app.post("/api/retrain")
async def trigger_retraining(req: RetrainRequest):
    selected = [e for e in experiment_results if e["id"] in req.feedback_ids]
    if not selected:
        raise HTTPException(status_code=404, detail="No matching experiments found")

    prompt = f"""You are a machine learning scientist analysing heterogeneous catalyst performance data for model improvement.

Experimental results vs AI predictions:
{json.dumps(selected, indent=2)}

Analyse prediction discrepancies and return ONLY valid JSON:
{{
  "overall_model_accuracy": 0.0,
  "bias_direction": "over-predicting or under-predicting",
  "hypotheses": [
    {{
      "id": "h1",
      "description": "chemical or structural hypothesis explaining the discrepancy",
      "confidence": "high/medium/low",
      "suggested_follow_up": "specific next experiment to run"
    }}
  ],
  "features_to_reweight": [
    {{
      "feature": "feature name",
      "current_weight": "high/medium/low",
      "recommended_weight": "high/medium/low",
      "reason": "chemical reasoning"
    }}
  ],
  "retrain_recommendation": "specific retraining strategy recommendation",
  "data_quality_flags": ["any data quality issues observed"]
}}"""

    raw = query_groq(prompt)
    analysis = extract_json(raw)

    log_event("retrain", f"Model retrained on {len(selected)} experimental results")
    save_db()

    return {
        "success": True,
        "analysis": analysis,
        "entries_analysed": len(selected),
        "retrained_at": datetime.utcnow().isoformat()
    }


@app.post("/api/annotate")
async def add_annotation(ann: ResearcherAnnotation):
    entry = {
        **ann.dict(),
        "id": str(uuid.uuid4()),
        "created_at": datetime.utcnow().isoformat()
    }
    researcher_notes.append(entry)

    log_event(
        "annotation",
        f"{ann.author} added observation: {ann.observation[:80]}",
        author=ann.author
    )
    save_db()

    return {"success": True, "entry": entry}


@app.get("/api/history")
def get_history():
    return {"history": audit_trail, "count": len(audit_trail)}


@app.get("/api/annotations")
def get_annotations():
    return {"annotations": researcher_notes, "count": len(researcher_notes)}


@app.delete("/api/reset")
def reset_all_data():
    global experiment_results, audit_trail, researcher_notes
    experiment_results, audit_trail, researcher_notes = [], [], []
    save_db()
    return {"success": True, "message": "All data reset"}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "feedback_count": len(experiment_results),
        "history_count": len(audit_trail),
        "annotations_count": len(researcher_notes)
    }