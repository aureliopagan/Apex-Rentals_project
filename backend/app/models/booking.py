from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, DECIMAL, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REJECTED = "rejected"

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    REFUNDED = "refunded"
    FAILED = "failed"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    
    # Booking details
    start_datetime = Column(DateTime(timezone=True), nullable=False)
    end_datetime = Column(DateTime(timezone=True), nullable=False)
    total_hours = Column(Integer, nullable=False)
    total_days = Column(Integer, nullable=False)
    
    # Pricing
    hourly_rate = Column(DECIMAL(10, 2), nullable=False)
    daily_rate = Column(DECIMAL(10, 2), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    tax_amount = Column(DECIMAL(10, 2), nullable=False, default=0)
    service_fee = Column(DECIMAL(10, 2), nullable=False, default=0)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    
    # Status and payment
    booking_status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    payment_method = Column(String(50), nullable=True)
    transaction_id = Column(String(100), nullable=True)
    
    # Additional info
    special_requests = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    is_reviewed_by_client = Column(Boolean, default=False)
    is_reviewed_by_owner = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    client = relationship("User", foreign_keys=[client_id], back_populates="bookings_made")
    owner = relationship("User", foreign_keys=[owner_id], back_populates="bookings_received")
    asset = relationship("Asset", back_populates="bookings")
    reviews = relationship("Review", back_populates="booking", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Booking(id={self.id}, asset_id={self.asset_id}, status='{self.booking_status.value}')>"
