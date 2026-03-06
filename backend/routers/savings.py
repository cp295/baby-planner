from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import SavingsGoal
from schemas import (
    SavingsGoalOut,
    SavingsGoalBase,
    SavingsGoalUpdate,
    SavingsProjectionRequest,
    SavingsProjectionResponse,
    SavingsProjectionPoint,
)

router = APIRouter(prefix="/api/savings", tags=["savings"])

# Average 4-year public university cost in Colorado (2026), growing ~5% per year
COLLEGE_COST_BASE = 115_000  # total 4-year at CU Boulder (tuition+room+board)


@router.get("/goals", response_model=list[SavingsGoalOut])
def list_goals(db: Session = Depends(get_db)):
    return db.query(SavingsGoal).all()


@router.post("/goals", response_model=SavingsGoalOut)
def create_goal(payload: SavingsGoalBase, db: Session = Depends(get_db)):
    goal = SavingsGoal(**payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/goals/{goal_id}", response_model=SavingsGoalOut)
def update_goal(
    goal_id: int,
    payload: SavingsGoalUpdate,
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


@router.post("/project", response_model=SavingsProjectionResponse)
def project_savings(body: SavingsProjectionRequest):
    """
    Project 529 growth year by year using compound interest.
    Also calculates the monthly contribution needed to hit target.
    """
    monthly_rate = body.annual_rate / 100 / 12
    balance = body.initial_amount
    total_contributions = body.initial_amount
    points: list[SavingsProjectionPoint] = []

    for year in range(1, body.years + 1):
        for _ in range(12):
            balance = balance * (1 + monthly_rate) + body.monthly_contribution
            total_contributions += body.monthly_contribution

        total_earnings = balance - total_contributions
        points.append(
            SavingsProjectionPoint(
                year=year,
                balance=round(balance, 2),
                contributions=round(total_contributions, 2),
                earnings=round(max(total_earnings, 0), 2),
            )
        )

    # How much needs to be saved monthly to hit target from $0
    # FV = PMT * [(1+r)^n - 1] / r  →  PMT = FV * r / [(1+r)^n - 1]
    n = body.years * 12
    if monthly_rate > 0 and n > 0:
        monthly_needed = round(
            body.target_amount * monthly_rate / ((1 + monthly_rate) ** n - 1), 2
        )
    else:
        monthly_needed = round(body.target_amount / n, 2) if n else 0

    return SavingsProjectionResponse(
        points=points,
        final_balance=round(balance, 2),
        total_contributions=round(total_contributions, 2),
        total_earnings=round(max(balance - total_contributions, 0), 2),
        target_amount=body.target_amount,
        monthly_needed=monthly_needed,
    )


@router.get("/college-cost")
def college_cost_estimate(years_until_college: int = 18):
    """Estimate future cost of college with 5% annual inflation."""
    future_cost = COLLEGE_COST_BASE * (1.05 ** years_until_college)
    return {
        "base_cost_today": COLLEGE_COST_BASE,
        "years_until_college": years_until_college,
        "inflation_rate": 0.05,
        "estimated_future_cost": round(future_cost, 0),
    }
