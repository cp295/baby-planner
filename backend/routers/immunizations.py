from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import Immunization
from schemas import ImmunizationOut, ImmunizationUpdate

router = APIRouter(prefix="/api/immunizations", tags=["immunizations"])


@router.get("/", response_model=list[ImmunizationOut])
def list_immunizations(
    completed: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Immunization)
    if completed is not None:
        q = q.filter(Immunization.is_completed == completed)
    return q.order_by(Immunization.age_weeks, Immunization.vaccine_name).all()


@router.patch("/{immunization_id}", response_model=ImmunizationOut)
def update_immunization(
    immunization_id: int,
    payload: ImmunizationUpdate,
    db: Session = Depends(get_db),
):
    imm = db.query(Immunization).filter(Immunization.id == immunization_id).first()
    if not imm:
        raise HTTPException(status_code=404, detail="Immunization not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(imm, field, value)
    db.commit()
    db.refresh(imm)
    return imm


@router.get("/stats")
def immunization_stats(db: Session = Depends(get_db)):
    total = db.query(Immunization).count()
    completed = db.query(Immunization).filter(Immunization.is_completed == True).count()
    return {
        "total": total,
        "completed": completed,
        "remaining": total - completed,
        "percent_complete": round((completed / total * 100) if total else 0, 1),
    }
