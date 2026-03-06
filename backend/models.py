from sqlalchemy import Column, Integer, String, Boolean, Float, Date, Text
from database import Base


class Immunization(Base):
    __tablename__ = "immunizations"

    id = Column(Integer, primary_key=True, index=True)
    vaccine_name = Column(String, nullable=False)
    age_label = Column(String, nullable=False)      # e.g. "2 months"
    age_weeks = Column(Integer, nullable=False)     # weeks from birth for sorting
    doses = Column(Integer, default=1)
    dose_number = Column(Integer, default=1)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)           # daycare | preschool | elementary | middle | high
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    rating = Column(Float, nullable=True)           # 1-5 stars
    monthly_cost_min = Column(Integer, nullable=True)
    monthly_cost_max = Column(Integer, nullable=True)
    enrollment_age_min = Column(Float, nullable=True)   # months for daycare, years for schools
    enrollment_age_max = Column(Float, nullable=True)
    waitlist_months = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    distance_miles = Column(Float, nullable=True)
    is_favorited = Column(Boolean, default=False)


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    goal_name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    monthly_contribution = Column(Float, default=0.0)
    interest_rate = Column(Float, default=7.0)    # annual % (529 average)
    target_year = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
