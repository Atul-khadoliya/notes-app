from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated

from app import crud, models, schemas, security
from app.database import SessionLocal, engine


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://notes-app-pi-six.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Notes App API!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), token: str = Depends(security.oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except security.JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user



@app.post("/token")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)



@app.post("/notes/", response_model=schemas.Note)
def create_note(
    note: schemas.NoteCreate, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.create_user_note(db=db, note=note, user_id=current_user.id)

@app.get("/notes/", response_model=list[schemas.Note])
def read_notes(
    current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.get_notes_by_user(db, user_id=current_user.id)

@app.put("/notes/{note_id}", response_model=schemas.Note)
def update_note(
    note_id: int, note: schemas.NoteCreate, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    db_note = crud.update_note(db, note_id=note_id, owner_id=current_user.id, note_update=note)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found or you don't have permission to edit it")
    return db_note

@app.delete("/notes/{note_id}", response_model=schemas.Note)
def delete_note(
    note_id: int, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    db_note = crud.delete_note(db, note_id=note_id, owner_id=current_user.id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found or you don't have permission to delete it")
    return db_note