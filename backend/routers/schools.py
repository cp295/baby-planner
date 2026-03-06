from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import School
from schemas import SchoolOut, SchoolUpdate

router = APIRouter(prefix="/api/schools", tags=["schools"])


@router.get("/", response_model=list[SchoolOut])
def list_schools(
    type: Optional[str] = Query(None),
    favorites_only: bool = False,
    db: Session = Depends(get_db),
):
    q = db.query(School)
    if type:
        q = q.filter(School.type == type)
    if favorites_only:
        q = q.filter(School.is_favorited == True)
    return q.order_by(School.distance_miles).all()


@router.patch("/{school_id}", response_model=SchoolOut)
def update_school(
    school_id: int,
    payload: SchoolUpdate,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(school, field, value)
    db.commit()
    db.refresh(school)
    return school
