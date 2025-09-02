from pydantic import BaseModel



class NoteBase(BaseModel):
    title: str
    content: str | None = None

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    owner_id: int
    share_id: str

    class Config:
        from_attributes = True 



class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True 
    notes: list[Note] = []

    class Config:
        from_attributes = True 

class TokenData(BaseModel):
    username: str | None = None



class NotePublic(BaseModel):
    title: str
    content: str | None = None

    class Config:
        from_attributes = True