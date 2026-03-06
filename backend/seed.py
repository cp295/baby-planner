"""Populate the database with starter data."""
from database import engine, SessionLocal
from models import Base, Immunization, School, SavingsGoal
from data.seed_immunizations import IMMUNIZATIONS
from data.seed_schools import SCHOOLS
from data.seed_savings import SAVINGS_GOALS


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Only seed if empty
        if db.query(Immunization).count() == 0:
            for item in IMMUNIZATIONS:
                db.add(Immunization(**item))
            print(f"Seeded {len(IMMUNIZATIONS)} immunizations")

        if db.query(School).count() == 0:
            for item in SCHOOLS:
                db.add(School(**item))
            print(f"Seeded {len(SCHOOLS)} schools/daycares")

        if db.query(SavingsGoal).count() == 0:
            for item in SAVINGS_GOALS:
                db.add(SavingsGoal(**item))
            print(f"Seeded {len(SAVINGS_GOALS)} savings goals")

        db.commit()
        print("Database seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
