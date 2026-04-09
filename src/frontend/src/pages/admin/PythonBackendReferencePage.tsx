import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Copy,
  Database,
  Download,
  Key,
  Layers,
  Server,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Code content ────────────────────────────────────────────────────────────

const OVERVIEW_ARCH = `
┌─────────────────────────────────────────────────────────────────────┐
│                      School ERP Architecture                         │
│                                                                       │
│  ┌──────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │
│  │   React SPA  │───▶│  FastAPI Server  │───▶│  PostgreSQL + Redis │ │
│  │  (Vite/TS)   │◀───│  (Uvicorn/ASGI) │◀───│  (Primary + Cache)  │ │
│  └──────────────┘    └────────┬────────┘    └─────────────────────┘ │
│                               │                                       │
│                    ┌──────────▼──────────┐                           │
│                    │   Alembic Migrations │                           │
│                    │   (Schema Evolution) │                           │
│                    └─────────────────────┘                           │
│                                                                       │
│  Modules:  Students · Attendance · Fees · Exams · Users · Audit     │
└─────────────────────────────────────────────────────────────────────┘`;

const REQUIREMENTS_TXT = `# requirements.txt
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
psycopg2-binary==2.9.9
redis==5.0.4
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
pydantic==2.7.1
pydantic-settings==2.2.1
python-dotenv==1.0.1
pytest==8.2.0
httpx==0.27.0`;

const ENV_VARS = `# .env
DATABASE_URL=postgresql://erp_user:erp_pass@localhost:5432/school_erp
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,https://yourschool.edu.in
APP_NAME=SmartSkale School ERP
APP_VERSION=1.0.0`;

const MODELS_PY = `# models.py
import uuid, datetime, enum
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    DateTime, ForeignKey, Text, UniqueConstraint
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

def gen_id():
    return str(uuid.uuid4())

# ─── Enums ───────────────────────────────────────────────────────────

class FeeStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    overdue = "overdue"
    partial = "partial"

class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"
    halfday = "halfday"

# ─── Student ─────────────────────────────────────────────────────────

class Student(Base):
    __tablename__ = "students"

    id             = Column(String, primary_key=True, default=gen_id)
    admission_no   = Column(String(20), unique=True, nullable=False, index=True)
    name           = Column(String(100), nullable=False, index=True)
    class_name     = Column(String(20), nullable=False, index=True)
    section        = Column(String(20), nullable=False)
    roll_no        = Column(Integer, nullable=False)
    dob            = Column(String(10), nullable=False)
    gender         = Column(String(10))
    phone          = Column(String(15))
    parent_name    = Column(String(100))
    parent_mobile  = Column(String(15), index=True)
    address        = Column(Text)
    fee_status     = Column(String(20), default=FeeStatus.pending.value)
    admission_date = Column(String(10))
    status         = Column(String(20), default="active")
    blood_group    = Column(String(5))
    religion       = Column(String(30))
    category       = Column(String(30))
    created_at     = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at     = Column(DateTime, onupdate=datetime.datetime.utcnow)

    attendances  = relationship("Attendance", back_populates="student")
    fee_payments = relationship("FeePayment", back_populates="student")
    marks        = relationship("StudentMarks", back_populates="student")

# ─── Attendance ──────────────────────────────────────────────────────

class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (
        UniqueConstraint("student_id", "date", name="uq_student_date"),
    )

    id         = Column(String, primary_key=True, default=gen_id)
    student_id = Column(String, ForeignKey("students.id"), index=True)
    date       = Column(String(10), index=True)
    class_name = Column(String(20), index=True)
    section    = Column(String(20))
    status     = Column(String(20), default=AttendanceStatus.present.value)
    marked_by  = Column(String(100))
    remarks    = Column(Text, default="")

    student = relationship("Student", back_populates="attendances")

# ─── Fee ─────────────────────────────────────────────────────────────

class FeeCategory(Base):
    __tablename__ = "fee_categories"

    id            = Column(String, primary_key=True, default=gen_id)
    name          = Column(String(100), nullable=False)
    amount        = Column(Float, nullable=False)
    class_name    = Column(String(20), index=True)
    section       = Column(String(20))
    academic_year = Column(String(10), index=True)
    due_date      = Column(String(10))
    is_optional   = Column(Boolean, default=False)

class FeePayment(Base):
    __tablename__ = "fee_payments"

    id            = Column(String, primary_key=True, default=gen_id)
    student_id    = Column(String, ForeignKey("students.id"), index=True)
    receipt_no    = Column(String(20), unique=True, index=True)
    payment_date  = Column(String(10), index=True)
    total_amount  = Column(Float)
    paid_amount   = Column(Float)
    balance       = Column(Float)
    payment_mode  = Column(String(20))   # cash | online | upi | cheque
    txn_id        = Column(String(100))
    status        = Column(String(20))
    academic_year = Column(String(10))

    student = relationship("Student", back_populates="fee_payments")

# ─── Exams ───────────────────────────────────────────────────────────

class Exam(Base):
    __tablename__ = "exams"

    id            = Column(String, primary_key=True, default=gen_id)
    title         = Column(String(200), nullable=False)
    subject       = Column(String(100), index=True)
    class_name    = Column(String(20), index=True)
    section       = Column(String(20))
    exam_date     = Column(String(10))
    max_marks     = Column(Integer, nullable=False)
    duration      = Column(Integer)     # minutes
    academic_year = Column(String(10), index=True)
    term          = Column(String(50))
    created_by    = Column(String(100))

    student_marks = relationship("StudentMarks", back_populates="exam")

class StudentMarks(Base):
    __tablename__ = "student_marks"

    id             = Column(String, primary_key=True, default=gen_id)
    exam_id        = Column(String, ForeignKey("exams.id"), index=True)
    student_id     = Column(String, ForeignKey("students.id"), index=True)
    obtained_marks = Column(Float)
    grade          = Column(String(5))
    rank           = Column(Integer)
    remarks        = Column(Text)

    exam    = relationship("Exam", back_populates="student_marks")
    student = relationship("Student", back_populates="marks")

# ─── Users & Permissions ─────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id              = Column(String, primary_key=True, default=gen_id)
    name            = Column(String(100))
    email           = Column(String(200), unique=True, index=True)
    role            = Column(String(50))    # admin | teacher | student | parent …
    status          = Column(String(20), default="active")
    hashed_password = Column(String(200))
    permissions     = Column(Text)          # JSON array of permission keys
    created_at      = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at      = Column(DateTime, onupdate=datetime.datetime.utcnow)

# ─── Audit Log ───────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id            = Column(String, primary_key=True, default=gen_id)
    timestamp     = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    actor_id      = Column(String, index=True)
    actor_name    = Column(String(100))
    action        = Column(String(100))       # CREATE | UPDATE | DELETE | LOGIN
    resource_type = Column(String(50))        # User | Student | Permission …
    resource_id   = Column(String)
    before_value  = Column(Text)              # JSON snapshot
    after_value   = Column(Text)              # JSON snapshot
    status        = Column(String(20))        # success | failed
    ip_address    = Column(String(45))`;

const SCHEMAS_PY = `# schemas.py  (Pydantic v2)
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import re

class StudentBase(BaseModel):
    admission_no:  str = Field(..., max_length=20)
    name:          str = Field(..., max_length=100)
    class_name:    str
    section:       str
    roll_no:       int = Field(..., ge=1)
    dob:           str  # YYYY-MM-DD
    gender:        Optional[str] = None
    parent_name:   Optional[str] = None
    parent_mobile: Optional[str] = None
    address:       Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name:          Optional[str] = None
    class_name:    Optional[str] = None
    section:       Optional[str] = None
    roll_no:       Optional[int] = None
    parent_name:   Optional[str] = None
    parent_mobile: Optional[str] = None
    fee_status:    Optional[str] = None
    status:        Optional[str] = None

class StudentResponse(StudentBase):
    id:            str
    fee_status:    str
    status:        str
    model_config = {"from_attributes": True}

class StudentPage(BaseModel):
    students:  List[StudentResponse]
    total:     int
    page:      int
    page_size: int

class AttendanceRecord(BaseModel):
    student_id: str
    status:     str  # present | absent | late | halfday

class BulkAttendanceRequest(BaseModel):
    date:       str
    class_name: str
    section:    str
    marked_by:  str
    records:    List[AttendanceRecord]

class FeePaymentCreate(BaseModel):
    student_id:    str
    receipt_no:    str
    payment_date:  str
    total_amount:  float = Field(..., gt=0)
    paid_amount:   float = Field(..., gt=0)
    payment_mode:  str
    txn_id:        Optional[str] = None
    academic_year: str

    @field_validator("receipt_no")
    @classmethod
    def validate_receipt_no(cls, v: str) -> str:
        if not re.match(r"^RCP-\\d{6}$", v):
            raise ValueError("Receipt number must be RCP-XXXXXX (6 digits)")
        return v

    @field_validator("paid_amount")
    @classmethod
    def paid_lte_total(cls, v: float, info) -> float:
        total = info.data.get("total_amount")
        if total is not None and v > total:
            raise ValueError("Paid amount cannot exceed total amount")
        return v`;

const ENDPOINTS_PY = `# routers/students.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import Student
from ..schemas import StudentCreate, StudentUpdate, StudentResponse, StudentPage
from ..auth import require_permission
import uuid

router = APIRouter(prefix="/students", tags=["students"])

@router.get("", response_model=StudentPage)
async def list_students(
    name:          Optional[str] = Query(None, description="Partial name search"),
    admission_no:  Optional[str] = Query(None),
    class_name:    Optional[str] = Query(None),
    section:       Optional[str] = Query(None),
    status:        Optional[str] = Query("active"),
    page:          int = Query(1, ge=1),
    page_size:     int = Query(20, ge=1, le=100),
    db:            Session = Depends(get_db),
    _token:        dict = Depends(require_permission("Students.View")),
):
    q = db.query(Student)
    if name:         q = q.filter(Student.name.ilike(f"%{name}%"))
    if admission_no: q = q.filter(Student.admission_no == admission_no)
    if class_name:   q = q.filter(Student.class_name == class_name)
    if section:      q = q.filter(Student.section == section)
    if status:       q = q.filter(Student.status == status)

    total    = q.count()
    students = q.offset((page - 1) * page_size).limit(page_size).all()
    return StudentPage(students=students, total=total, page=page, page_size=page_size)

@router.post("", response_model=StudentResponse, status_code=201)
async def create_student(
    body:   StudentCreate,
    db:     Session = Depends(get_db),
    _token: dict = Depends(require_permission("Students.Add")),
):
    if db.query(Student).filter(Student.admission_no == body.admission_no).first():
        raise HTTPException(400, "Admission number already registered")
    student = Student(**body.model_dump(), id=str(uuid.uuid4()))
    db.add(student); db.commit(); db.refresh(student)
    return student

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    db:         Session = Depends(get_db),
    _token:     dict = Depends(require_permission("Students.View")),
):
    s = db.query(Student).filter(Student.id == student_id).first()
    if not s: raise HTTPException(404, "Student not found")
    return s

@router.patch("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    body:       StudentUpdate,
    db:         Session = Depends(get_db),
    _token:     dict = Depends(require_permission("Students.Edit")),
):
    s = db.query(Student).filter(Student.id == student_id).first()
    if not s: raise HTTPException(404, "Student not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(s, field, value)
    db.commit(); db.refresh(s)
    return s

@router.delete("/{student_id}", status_code=204)
async def delete_student(
    student_id: str,
    db:         Session = Depends(get_db),
    _token:     dict = Depends(require_permission("Students.Delete")),
):
    s = db.query(Student).filter(Student.id == student_id).first()
    if not s: raise HTTPException(404, "Student not found")
    db.delete(s); db.commit()

# ─── routers/attendance.py ───────────────────────────────────────────────────

@router.post("/attendance/bulk", tags=["attendance"])
async def mark_bulk_attendance(
    body: BulkAttendanceRequest,
    db:   Session = Depends(get_db),
    _t:   dict = Depends(require_permission("Attendance.Mark")),
):
    for record in body.records:
        existing = (
            db.query(Attendance)
            .filter_by(student_id=record.student_id, date=body.date)
            .first()
        )
        if existing:
            existing.status = record.status
        else:
            db.add(Attendance(
                id=str(uuid.uuid4()),
                student_id=record.student_id,
                date=body.date,
                class_name=body.class_name,
                section=body.section,
                status=record.status,
                marked_by=body.marked_by,
            ))
    db.commit()
    return {"saved": len(body.records), "date": body.date}

# ─── routers/fees.py ─────────────────────────────────────────────────────────

@router.post("/fees/payments", tags=["fees"])
async def record_payment(
    body: FeePaymentCreate,
    db:   Session = Depends(get_db),
    _t:   dict = Depends(require_permission("FeeManagement.Collect")),
):
    if db.query(FeePayment).filter_by(receipt_no=body.receipt_no).first():
        raise HTTPException(400, "Receipt number already exists — duplicate prevented")
    payment = FeePayment(**body.model_dump(), id=str(uuid.uuid4()))
    db.add(payment); db.commit(); db.refresh(payment)
    return payment

@router.get("/fees/report", tags=["fees"])
async def fee_report(
    date_from:  str,
    date_to:    str,
    class_name: Optional[str] = None,
    db:         Session = Depends(get_db),
    _t:         dict = Depends(require_permission("Reports.FeeDaily")),
):
    q = db.query(FeePayment).filter(
        FeePayment.payment_date >= date_from,
        FeePayment.payment_date <= date_to
    )
    if class_name: q = q.filter(FeePayment.class_name == class_name)
    payments = q.all()
    total = sum(p.paid_amount for p in payments)
    cash  = sum(p.paid_amount for p in payments if p.payment_mode == "cash")
    return {
        "total_collected": total,
        "cash":            cash,
        "online":          total - cash,
        "count":           len(payments),
        "date_from":       date_from,
        "date_to":         date_to,
    }

# ─── routers/exams.py ────────────────────────────────────────────────────────

@router.post("/exams/{exam_id}/marks", tags=["exams"])
async def submit_marks(
    exam_id: str,
    records: List[dict],
    db:      Session = Depends(get_db),
    _t:      dict = Depends(require_permission("Academics.MarksEntry")),
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam: raise HTTPException(404, "Exam not found")
    for rec in records:
        obtained = rec.get("obtained_marks", 0)
        if obtained < 0 or obtained > exam.max_marks:
            raise HTTPException(
                400,
                f"Marks {obtained} out of range (0–{exam.max_marks})"
            )
        existing = db.query(StudentMarks).filter_by(
            exam_id=exam_id, student_id=rec["student_id"]
        ).first()
        grade = "A+" if obtained/exam.max_marks >= 0.9 else \
                "A"  if obtained/exam.max_marks >= 0.75 else \
                "B"  if obtained/exam.max_marks >= 0.6 else \
                "C"  if obtained/exam.max_marks >= 0.45 else "F"
        if existing:
            existing.obtained_marks = obtained
            existing.grade = grade
        else:
            db.add(StudentMarks(
                id=str(uuid.uuid4()),
                exam_id=exam_id,
                student_id=rec["student_id"],
                obtained_marks=obtained,
                grade=grade,
            ))
    db.commit()
    return {"updated": len(records)}`;

const DATABASE_PY = `# database.py
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from typing import Generator
import redis
import json
import os

# ─── PostgreSQL ──────────────────────────────────────────────────────

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://erp_user:erp_pass@localhost:5432/school_erp"
)

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,          # keep 10 connections ready
    max_overflow=20,       # allow 20 extra on spike
    pool_timeout=30,       # wait 30s before giving up
    pool_recycle=1800,     # recycle connections every 30 min
    echo=False,            # set True for SQL debug logging
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# FastAPI dependency — injects a DB session into each request
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# ─── Redis Cache ─────────────────────────────────────────────────────

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client = redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_timeout=5,
    socket_connect_timeout=5,
    retry_on_timeout=True,
)

def cache_get(key: str) -> str | None:
    try:
        return redis_client.get(key)
    except redis.RedisError:
        return None   # graceful fallback — don't crash on cache miss

def cache_set(key: str, value: str, ttl: int = 300) -> None:
    try:
        redis_client.setex(key, ttl, value)
    except redis.RedisError:
        pass   # cache failure is non-fatal

def cache_delete(key: str) -> None:
    try:
        redis_client.delete(key)
    except redis.RedisError:
        pass

def cache_invalidate_pattern(pattern: str) -> None:
    """Delete all keys matching a glob pattern (e.g. 'students:*')"""
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except redis.RedisError:
        pass

# ─── Cached query helper ─────────────────────────────────────────────

async def get_students_by_class(class_name: str, db: Session) -> list:
    cache_key = f"students:class:{class_name}"
    cached = cache_get(cache_key)
    if cached:
        return json.loads(cached)

    from .models import Student
    students = (
        db.query(Student)
        .filter(Student.class_name == class_name, Student.status == "active")
        .order_by(Student.roll_no)
        .all()
    )
    serialized = [
        {
            "id":           s.id,
            "admission_no": s.admission_no,
            "name":         s.name,
            "class_name":   s.class_name,
            "section":      s.section,
            "roll_no":      s.roll_no,
        }
        for s in students
    ]
    cache_set(cache_key, json.dumps(serialized), ttl=600)  # 10 min
    return serialized

# ─── Full-text search helper ─────────────────────────────────────────

def search_students(term: str, db: Session, limit: int = 20) -> list:
    """
    Search by name, admission_no, or parent_mobile.
    PostgreSQL ilike is fast enough for < 50k students.
    For large DBs: add a GIN index on tsvector(name) via Alembic.
    """
    from .models import Student
    like = f"%{term}%"
    return (
        db.query(Student)
        .filter(
            Student.name.ilike(like)
            | Student.admission_no.ilike(like)
            | Student.parent_mobile.ilike(like)
        )
        .filter(Student.status == "active")
        .limit(limit)
        .all()
    )`;

const AUTH_PY = `# auth.py
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List
import os

SECRET_KEY                  = os.getenv("SECRET_KEY", "change-me-in-production-32-chars+")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security    = HTTPBearer(auto_error=False)

# ─── Password helpers ────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ─── JWT ─────────────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def verify_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    return decode_token(credentials.credentials)

# ─── Permission guard ────────────────────────────────────────────────

def require_permission(permission: str):
    """
    Usage:  Depends(require_permission("Students.Add"))
    Token must contain a 'permissions' list that includes this key.
    Super-admins bypass all checks.
    """
    def checker(token: dict = Depends(verify_token)) -> dict:
        role = token.get("role", "")
        if role in ("admin", "super-admin"):
            return token   # admins have all permissions
        permissions: List[str] = token.get("permissions", [])
        if permission not in permissions:
            raise HTTPException(
                status_code=403,
                detail=f"Permission '{permission}' is required for this action",
            )
        return token
    return checker

# ─── Login routes ────────────────────────────────────────────────────

from fastapi import APIRouter
from sqlalchemy.orm import Session
from .database import get_db
from .models import User, Student

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/login")
async def staff_login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(401, "Invalid email or password")
    if user.status != "active":
        raise HTTPException(403, "Account is disabled. Contact administrator.")
    import json
    permissions = json.loads(user.permissions or "[]")
    token = create_access_token({
        "sub":         user.id,
        "name":        user.name,
        "email":       user.email,
        "role":        user.role,
        "permissions": permissions,
    })
    return {
        "access_token": token,
        "token_type":   "bearer",
        "role":         user.role,
        "name":         user.name,
    }

@auth_router.post("/student-login")
async def student_login(admission_no: str, dob: str, db: Session = Depends(get_db)):
    """Students use admission number + date of birth as credentials."""
    student = db.query(Student).filter_by(
        admission_no=admission_no, dob=dob, status="active"
    ).first()
    if not student:
        raise HTTPException(401, "Invalid admission number or date of birth")
    token = create_access_token({
        "sub":         student.id,
        "name":        student.name,
        "role":        "student",
        "class_name":  student.class_name,
        "permissions": ["Dashboard", "Results", "Attendance", "StudentFees"],
    })
    return {"access_token": token, "token_type": "bearer", "role": "student"}

@auth_router.post("/refresh")
async def refresh_token(token: dict = Depends(verify_token)):
    """Issue a fresh token with the same claims."""
    token.pop("exp", None)
    return {"access_token": create_access_token(token), "token_type": "bearer"}`;

const DOCKER_COMPOSE = `# docker-compose.yml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL:               postgresql://erp:erp123@postgres:5432/school_erp
      REDIS_URL:                  redis://redis:6379/0
      SECRET_KEY:                 change-me-in-production-min-32-chars
      ACCESS_TOKEN_EXPIRE_MINUTES: "480"
      ENVIRONMENT:                production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER:     erp
      POSTGRES_PASSWORD: erp123
      POSTGRES_DB:       school_erp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U erp -d school_erp"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:`;

const DOCKERFILE = `# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# System dependencies for psycopg2
RUN apt-get update && apt-get install -y \\
    libpq-dev gcc \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run Alembic migrations then start Uvicorn
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4"]`;

const ALEMBIC_CMDS = `# Alembic migration commands

# 1. Initialise (run once)
alembic init alembic

# 2. Configure alembic.ini — set sqlalchemy.url
#    or point to env var:
#    sqlalchemy.url = %(DATABASE_URL)s

# 3. Auto-generate migration from model changes
alembic revision --autogenerate -m "initial schema"

# 4. Apply all pending migrations
alembic upgrade head

# 5. Roll back one step
alembic downgrade -1

# 6. Check current revision in DB
alembic current

# 7. View migration history
alembic history --verbose

# ─── Example alembic/env.py snippet ───────────────────────────────────
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.models import Base          # import your Base
from app.database import DATABASE_URL

config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)
target_metadata = Base.metadata`;

const RAILWAY_DEPLOY = `# Deploy to Railway.app (recommended for quick start)

# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and link project
railway login
railway init

# 3. Add PostgreSQL and Redis services in Railway dashboard
#    (one click — Railway auto-injects DATABASE_URL and REDIS_URL)

# 4. Set environment variables
railway variables set SECRET_KEY=<your-secret>

# 5. Deploy
railway up

# ─── Deploy to Render.com ──────────────────────────────────────────────

# render.yaml
services:
  - type: web
    name: school-erp-api
    env: python
    buildCommand: "pip install -r requirements.txt && alembic upgrade head"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: school-erp-db
          property: connectionString
      - key: REDIS_URL
        value: redis://localhost:6379/0
      - key: SECRET_KEY
        generateValue: true

databases:
  - name: school-erp-db
    databaseName: school_erp
    user: erp`;

// ─── Components ──────────────────────────────────────────────────────────────

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
      data-ocid="python-ref.copy.button"
    >
      <Copy size={12} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeBlock({
  title,
  filename,
  content,
  lang = "python",
}: {
  title?: string;
  filename?: string;
  content: string;
  lang?: string;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden mb-5">
      {(title || filename) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            {filename && (
              <span className="text-xs text-zinc-400 font-mono ml-1">
                {filename}
              </span>
            )}
            {title && (
              <span className="text-xs text-zinc-300 font-medium">{title}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] border-zinc-600 text-zinc-400"
            >
              {lang}
            </Badge>
            <CopyButton content={content} />
          </div>
        </div>
      )}
      <pre className="bg-zinc-950 text-green-300 text-xs leading-relaxed p-4 overflow-x-auto font-mono whitespace-pre">
        <code>{content.trim()}</code>
      </pre>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-4 mb-6 border-b border-border">
      <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── Download All ────────────────────────────────────────────────────────────

function downloadAll() {
  const files = [
    { name: "requirements.txt", content: REQUIREMENTS_TXT },
    { name: ".env.example", content: ENV_VARS },
    { name: "models.py", content: MODELS_PY },
    { name: "schemas.py", content: SCHEMAS_PY },
    { name: "endpoints.py", content: ENDPOINTS_PY },
    { name: "database.py", content: DATABASE_PY },
    { name: "auth.py", content: AUTH_PY },
    { name: "docker-compose.yml", content: DOCKER_COMPOSE },
    { name: "Dockerfile", content: DOCKERFILE },
    { name: "alembic_commands.sh", content: ALEMBIC_CMDS },
    { name: "deploy_guide.sh", content: RAILWAY_DEPLOY },
  ];

  const joined = files
    .map(
      (f) =>
        `${"#".repeat(72)}\n# FILE: ${f.name}\n${"#".repeat(72)}\n\n${f.content.trim()}\n`,
    )
    .join("\n\n");

  const blob = new Blob([joined], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "school-erp-python-backend.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("All 11 files downloaded as school-erp-python-backend.txt");
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PythonBackendReferencePage() {
  return (
    <div className="space-y-6" data-ocid="python-ref.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code size={22} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Python Backend Reference
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            FastAPI + SQLAlchemy + PostgreSQL + Redis — production-ready
            reference for the School ERP system.
          </p>
        </div>
        <Button
          onClick={downloadAll}
          className="gap-2 shrink-0"
          data-ocid="python-ref.download-all.button"
        >
          <Download size={15} /> Download All Files
        </Button>
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2">
        {[
          "FastAPI 0.111",
          "SQLAlchemy 2.0",
          "PostgreSQL 16",
          "Redis 7",
          "Alembic 1.13",
          "Pydantic v2",
          "python-jose JWT",
          "passlib bcrypt",
        ].map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="text-xs"
            data-ocid={`python-ref.badge.${t.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {t}
          </Badge>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" data-ocid="python-ref.tabs">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" data-ocid="python-ref.tab.overview">
            <Layers size={14} className="mr-1.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="schema" data-ocid="python-ref.tab.schema">
            <Database size={14} className="mr-1.5" /> Schema Design
          </TabsTrigger>
          <TabsTrigger value="endpoints" data-ocid="python-ref.tab.endpoints">
            <Server size={14} className="mr-1.5" /> API Endpoints
          </TabsTrigger>
          <TabsTrigger value="database" data-ocid="python-ref.tab.database">
            <Database size={14} className="mr-1.5" /> DB Connection
          </TabsTrigger>
          <TabsTrigger value="auth" data-ocid="python-ref.tab.auth">
            <Key size={14} className="mr-1.5" /> Authentication
          </TabsTrigger>
          <TabsTrigger value="docker" data-ocid="python-ref.tab.docker">
            <Terminal size={14} className="mr-1.5" /> Docker &amp; Deploy
          </TabsTrigger>
        </TabsList>

        {/* ─── Overview ──────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-4 mt-5">
          <SectionHeader
            icon={Layers}
            title="Architecture Overview"
            description="FastAPI serves a RESTful JSON API. SQLAlchemy manages the PostgreSQL schema. Redis caches hot queries. Alembic handles schema migrations."
          />
          <CodeBlock
            title="System Architecture Diagram"
            filename="architecture.txt"
            content={OVERVIEW_ARCH}
            lang="text"
          />
          <CodeBlock
            title="Python Dependencies"
            filename="requirements.txt"
            content={REQUIREMENTS_TXT}
            lang="text"
          />
          <CodeBlock
            title="Environment Variables"
            filename=".env.example"
            content={ENV_VARS}
            lang="bash"
          />
        </TabsContent>

        {/* ─── Schema Design ─────────────────────────────────────── */}
        <TabsContent value="schema" className="space-y-4 mt-5">
          <SectionHeader
            icon={Database}
            title="SQLAlchemy Schema Design"
            description="ORM models for all core entities: Student, Attendance, FeePayment, Exam, StudentMarks, User, AuditLog. Each model maps to a PostgreSQL table."
          />
          <CodeBlock
            title="Core SQLAlchemy Models"
            filename="models.py"
            content={MODELS_PY}
            lang="python"
          />
          <CodeBlock
            title="Pydantic Request / Response Schemas"
            filename="schemas.py"
            content={SCHEMAS_PY}
            lang="python"
          />
        </TabsContent>

        {/* ─── API Endpoints ─────────────────────────────────────── */}
        <TabsContent value="endpoints" className="space-y-4 mt-5">
          <SectionHeader
            icon={Server}
            title="FastAPI Route Examples"
            description="Paginated list, CRUD, bulk attendance, fee recording with duplicate check, marks entry with range validation, and aggregated reports."
          />
          <CodeBlock
            title="Students, Attendance, Fees, Exams Endpoints"
            filename="routers/endpoints.py"
            content={ENDPOINTS_PY}
            lang="python"
          />
        </TabsContent>

        {/* ─── Database Connection ───────────────────────────────── */}
        <TabsContent value="database" className="space-y-4 mt-5">
          <SectionHeader
            icon={Database}
            title="Database Connection & Caching"
            description="Connection pooling with QueuePool, Redis cache with graceful fallback, cached student queries, and full-text search helper."
          />
          <CodeBlock
            title="SQLAlchemy Engine + Redis Cache"
            filename="database.py"
            content={DATABASE_PY}
            lang="python"
          />
        </TabsContent>

        {/* ─── Authentication ────────────────────────────────────── */}
        <TabsContent value="auth" className="space-y-4 mt-5">
          <SectionHeader
            icon={Key}
            title="JWT Authentication & RBAC"
            description="bcrypt password hashing, HS256 JWT tokens with 8-hour expiry, per-permission Depends guards, staff login and student login (admission no + DOB)."
          />
          <CodeBlock
            title="Auth Module — JWT + RBAC"
            filename="auth.py"
            content={AUTH_PY}
            lang="python"
          />
        </TabsContent>

        {/* ─── Docker & Deploy ───────────────────────────────────── */}
        <TabsContent value="docker" className="space-y-4 mt-5">
          <SectionHeader
            icon={Terminal}
            title="Docker & Deployment"
            description="Multi-service Docker Compose with PostgreSQL 16, Redis 7, Nginx reverse proxy. Alembic auto-migration on startup. Railway and Render deployment guides included."
          />
          <CodeBlock
            title="Docker Compose"
            filename="docker-compose.yml"
            content={DOCKER_COMPOSE}
            lang="yaml"
          />
          <CodeBlock
            title="Dockerfile"
            filename="Dockerfile"
            content={DOCKERFILE}
            lang="dockerfile"
          />
          <CodeBlock
            title="Alembic Migration Commands"
            filename="alembic_commands.sh"
            content={ALEMBIC_CMDS}
            lang="bash"
          />
          <CodeBlock
            title="Cloud Deployment (Railway / Render)"
            filename="deploy_guide.sh"
            content={RAILWAY_DEPLOY}
            lang="yaml"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
