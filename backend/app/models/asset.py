from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class AssetType(enum.Enum):
    YACHT = "yacht"
    CAR = "car"
    JET = "jet"
    HELICOPTER = "helicopter"
    MOTORCYCLE = "motorcycle"
    BOAT = "boat"

class AssetStatus(enum.Enum):
    AVAILABLE = "available"
    BOOKED = "booked"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    asset_type = Column(Enum(AssetType), nullable=False, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)  # Number of people
    price_per_hour = Column(DECIMAL(10, 2), nullable=False)
    price_per_day = Column(DECIMAL(10, 2), nullable=False)
    location = Column(String(200), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    status = Column(Enum(AssetStatus), nullable=False, default=AssetStatus.AVAILABLE)
    is_active = Column(Boolean, default=True)
    features = Column(Text, nullable=True)  # JSON string of features
    images = Column(Text, nullable=True)    # JSON string of image URLs
    fuel_type = Column(String(50), nullable=True)
    engine_specs = Column(String(200), nullable=True)
    insurance_info = Column(Text, nullable=True)
    minimum_rental_hours = Column(Integer, default=1)
    maximum_rental_days = Column(Integer, default=30)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="owned_assets")
    bookings = relationship("Booking", back_populates="asset", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="asset", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Asset(id={self.id}, title='{self.title}', type='{self.asset_type.value}')>"
