import shortuuid
from sqlalchemy.orm import Session

from app import models, schemas, security



def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



def get_notes_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Note).filter(models.Note.owner_id == user_id).offset(skip).limit(limit).all()

def create_user_note(db: Session, note: schemas.NoteCreate, user_id: int):
    
    share_id = shortuuid.uuid()
    db_note = models.Note(**note.model_dump(), owner_id=user_id, share_id=share_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note



def update_note(db: Session, note_id: int, owner_id: int, note_update: schemas.NoteCreate):
    
    db_note = db.query(models.Note).filter(
        models.Note.id == note_id, models.Note.owner_id == owner_id
    ).first()

    if db_note:
        db_note.title = note_update.title
        db_note.content = note_update.content
        db.commit()
        db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: int, owner_id: int):
  
    db_note = db.query(models.Note).filter(
        models.Note.id == note_id, models.Note.owner_id == owner_id
    ).first()

    if db_note:
        db.delete(db_note)
        db.commit()
    return db_note


def get_note_by_share_id(db: Session, share_id: str):
    return db.query(models.Note).filter(models.Note.share_id == share_id).first()