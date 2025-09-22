from datetime import datetime
from app import db
import enum

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(BookingStatus), default=BookingStatus.PENDING)
    special_requests = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    client = db.relationship("User", foreign_keys=[client_id], backref="bookings_made")
    owner = db.relationship("User", foreign_keys=[owner_id], backref="bookings_received")
    asset = db.relationship("Asset", backref="bookings")
    
    def to_dict(self, include_relations=False):
        """Convert booking object to dictionary"""
        booking_dict = {
            'id': self.id,
            'client_id': self.client_id,
            'owner_id': self.owner_id,
            'asset_id': self.asset_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'total_price': self.total_price,
            'status': self.status.value if self.status else None,
            'special_requests': self.special_requests,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        # Include related data if requested
        if include_relations:
            if self.client:
                booking_dict['client'] = {
                    'id': self.client.id,
                    'first_name': self.client.first_name,
                    'last_name': self.client.last_name,
                    'email': self.client.email
                }
            if self.asset:
                booking_dict['asset'] = {
                    'id': self.asset.id,
                    'title': self.asset.title,
                    'asset_type': self.asset.asset_type.value,
                    'location': self.asset.location
                }
        
        return booking_dict
    
    def calculate_total_days(self):
        """Calculate total days for the booking"""
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return 0
    
    def __repr__(self):
        return f'<Booking {self.id} - {self.status.value}>'