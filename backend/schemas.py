from pydantic import BaseModel
from typing import Optional
from datetime import date


# ── Immunization ─────────────────────────────────────────────
class ImmunizationBase(BaseModel):
    vaccine_name: str
    age_label: str
    age_weeks: int
    doses: int = 1
    dose_number: int = 1
    description: Optional[str] = None
    is_completed: bool = False
    completed_date: Optional[date] = None
    notes: Optional[str] = None


class ImmunizationUpdate(BaseModel):
    is_completed: Optional[bool] = None
    completed_date: Optional[date] = None
    notes: Optional[str] = None


class ImmunizationOut(ImmunizationBase):
    id: int
    model_config = {"from_attributes": True}


# ── School ────────────────────────────────────────────────────
class SchoolBase(BaseModel):
    name: str
    type: str
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    monthly_cost_min: Optional[int] = None
    monthly_cost_max: Optional[int] = None
    enrollment_age_min: Optional[float] = None
    enrollment_age_max: Optional[float] = None
    waitlist_months: Optional[int] = None
    notes: Optional[str] = None
    distance_miles: Optional[float] = None
    is_favorited: bool = False


class SchoolUpdate(BaseModel):
    is_favorited: Optional[bool] = None
    notes: Optional[str] = None


class SchoolOut(SchoolBase):
    id: int
    model_config = {"from_attributes": True}


# ── Savings ───────────────────────────────────────────────────
class SavingsGoalBase(BaseModel):
    goal_name: str
    target_amount: float
    current_amount: float = 0.0
    monthly_contribution: float = 0.0
    interest_rate: float = 7.0
    target_year: Optional[int] = None
    notes: Optional[str] = None


class SavingsGoalUpdate(BaseModel):
    current_amount: Optional[float] = None
    monthly_contribution: Optional[float] = None
    interest_rate: Optional[float] = None
    notes: Optional[str] = None


class SavingsGoalOut(SavingsGoalBase):
    id: int
    model_config = {"from_attributes": True}


# ── Calculator ────────────────────────────────────────────────
class SavingsProjectionRequest(BaseModel):
    initial_amount: float = 0.0
    monthly_contribution: float
    annual_rate: float = 7.0
    years: int = 18
    target_amount: float = 277000.0


class SavingsProjectionPoint(BaseModel):
    year: int
    balance: float
    contributions: float
    earnings: float


class SavingsProjectionResponse(BaseModel):
    points: list[SavingsProjectionPoint]
    final_balance: float
    total_contributions: float
    total_earnings: float
    target_amount: float
    monthly_needed: float
