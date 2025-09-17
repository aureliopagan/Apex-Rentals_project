from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class ReviewType(enum.Enum):
    ASSET_REVIEW = "asset_review"      # Client reviews the asset/experience
    CLIENT_REVIEW = "client_review"    # Owner reviews the client

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who wrote the review
    reviewed_id = Column(Integer, ForeignKey("users.id"), nullable=True)   # Who/what is being reviewed (user)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)     # Asset being reviewed
    
    review_type = Column(Enum(ReviewType), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(200), nullable=True)
    comment = Column(Text, nullable=False)
    
    # Specific rating categories (optional)
    cleanliness_rating = Column(Integer, nullable=True)    # 1-5
    communication_rating = Column(Integer, nullable=True)  # 1-5
    accuracy_rating = Column(Integer, nullable=True)       # 1-5
    value_rating = Column(Integer, nullable=True)          # 1-5
    
    # Response from the reviewed party
    response = Column(Text, nullable=True)
    response_date = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Constraints
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='valid_rating'),
        CheckConstraint('cleanliness_rating IS NULL OR (cleanliness_rating >= 1 AND cleanliness_rating <= 5)', name='valid_cleanliness_rating'),
        CheckConstraint('communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)', name='valid_communication_rating'),
        CheckConstraint('accuracy_rating IS NULL OR (accuracy_rating >= 1 AND accuracy_rating <= 5)', name='valid_accuracy_rating'),
        CheckConstraint('value_rating IS NULL OR (value_rating >= 1 AND value_rating <= 5)', name='valid_value_rating'),
    )
    
    # Relationships
    booking = relationship("Booking", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewed = relationship("User", foreign_keys=[reviewed_id], back_populates="reviews_received")
    asset = relationship("Asset", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, rating={self.rating}, type='{self.review_type.value}')>"
