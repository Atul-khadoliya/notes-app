from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL. For SQLite, it's the path to the file.
SQLALCHEMY_DATABASE_URL = "sqlite:///./notes.db"

# Create the SQLAlchemy engine. The 'check_same_thread' argument is needed for SQLite.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Each instance of SessionLocal will be a new database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This Base will be used to create our ORM models (our database tables as Python classes).
Base = declarative_base()