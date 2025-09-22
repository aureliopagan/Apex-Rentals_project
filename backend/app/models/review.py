from datetime import datetime
from app import db

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Who wrote the review
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Who is being reviewed
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    review_type = db.Column(db.String(20), nullable=False)  # 'asset' or 'user'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviewer = db.relationship("User", foreign_keys=[reviewer_id], backref="reviews_given")
    reviewee = db.relationship("User", foreign_keys=[reviewee_id], backref="reviews_received")
    asset = db.relationship("Asset", backref="reviews")
    booking = db.relationship("Booking", backref="reviews")
    
    def to_dict(self, include_relations=False):
        """Convert review object to dictionary"""
        review_dict = {
            'id': self.id,
            'booking_id': self.booking_id,
            'reviewer_id': self.reviewer_id,
            'reviewee_id': self.reviewee_id,
            'asset_id': self.asset_id,
            'rating': self.rating,
            'comment': self.comment,
            'review_type': self.review_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        # Include related data if requested
        if include_relations:
            if self.reviewer:
                review_dict['reviewer'] = {
                    'id': self.reviewer.id,
                    'first_name': self.reviewer.first_name,
                    'last_name': self.reviewer.last_name
                }
            if self.reviewee:
                review_dict['reviewee'] = {
                    'id': self.reviewee.id,
                    'first_name': self.reviewee.first_name,
                    'last_name': self.reviewee.last_name
                }
            if self.asset:
                review_dict['asset'] = {
                    'id': self.asset.id,
                    'title': self.asset.title,
                    'asset_type': self.asset.asset_type.value
                }
        
        return review_dict
    
    def __repr__(self):
        return f'<Review {self.id} - {self.rating} stars>'