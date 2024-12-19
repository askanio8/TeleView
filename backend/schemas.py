from typing import Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    phone_number: Optional[str] = None
    telegram_session: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone_number: Optional[str] = None
    telegram_session: Optional[str] = None

    class Config:
        orm_mode = True


class PhoneNumberRequest(BaseModel):
    phone_number: str


class VerificationRequest(BaseModel):
    phone_number: str
    code: str
    phone_code_hash: str