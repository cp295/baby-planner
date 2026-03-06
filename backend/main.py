from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import immunizations, schools, savings
from seed import seed

# Create tables and seed data on startup
Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Baby Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(immunizations.router)
app.include_router(schools.router)
app.include_router(savings.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/dashboard")
def dashboard_stats(db=None):
    """Quick stats for the overview page."""
    from database import SessionLocal
    from models import Immunization, School, SavingsGoal

    db = SessionLocal()
    try:
        total_imm = db.query(Immunization).count()
        completed_imm = db.query(Immunization).filter(Immunization.is_completed == True).count()
        total_schools = db.query(School).count()
        favorited = db.query(School).filter(School.is_favorited == True).count()
        goals = db.query(SavingsGoal).all()
        total_saved = sum(g.current_amount for g in goals)

        return {
            "immunizations": {
                "total": total_imm,
                "completed": completed_imm,
                "percent": round((completed_imm / total_imm * 100) if total_imm else 0, 1),
            },
            "schools": {
                "total": total_schools,
                "favorited": favorited,
            },
            "savings": {
                "total_saved": total_saved,
                "goals": len(goals),
            },
        }
    finally:
        db.close()
