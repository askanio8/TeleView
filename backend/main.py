import os

from fastapi import FastAPI, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas
import crud
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from telegram_utils import get_telegram_dialogs, verify_telegram_code_and_get_session, send_telegram_code
from dotenv import load_dotenv

models.Base.metadata.create_all(bind=engine)

load_dotenv()

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")

app = FastAPI()

# Добавляем механизм для работы с токенами/сессиями
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# CORS настройки для взаимодействия с frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/start-telegram-auth")
async def start_telegram_auth(request: schemas.PhoneNumberRequest, db: Session = Depends(get_db)):
    phone_number = request.phone_number
    user = db.query(models.User).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    try:
        # Отправить код подтверждения через Telegram и получить phone_code_hash
        result = await send_telegram_code(phone_number, API_ID, API_HASH)
        if not result.get("success"):
            raise HTTPException(status_code=400, detail="Failed to send confirmation code")

        # Сохраняем phone_code_hash в базе данных для последующей верификации
        user.telegram_phone_code_hash = result["phone_code_hash"]
        db.commit()

        return {
            "message": "Telegram code sent successfully",
            "phone_code_hash": result["phone_code_hash"]
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/verify-telegram-code")
async def verify_telegram_code(
        request: schemas.VerificationRequest,
        db: Session = Depends(get_db)
):
    user = db.query(models.User).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # Проверить код и сохранить строку сессии
    session_string = await verify_telegram_code_and_get_session(
        request.phone_number,
        request.code,
        request.phone_code_hash,
        API_ID,
        API_HASH
    )

    if not session_string:
        raise HTTPException(status_code=400, detail="Invalid code or verification failed")

    user.telegram_session = session_string
    db.commit()

    return {"message": "Telegram session verified and saved successfully"}

@app.get("/telegram-dialogs")
def get_user_telegram_dialogs(db: Session = Depends(get_db)):

    user = db.query(models.User).first()

    if not user or not user.telegram_session:
        raise HTTPException(status_code=400, detail="No Telegram session found")

    dialogs = get_telegram_dialogs(user.telegram_session, API_ID, API_HASH)
    return dialogs


@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    authenticated_user = crud.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    # В реальном приложении здесь нужно генерировать JWT токен
    return {"message": "Login successful"}

@app.post("/logout")
def logout(response: Response):
    # В реальном приложении здесь нужно инвалидировать токен
    response.delete_cookie("access_token")  # Удаление куки с токеном
    return {"message": "Logout successful"}