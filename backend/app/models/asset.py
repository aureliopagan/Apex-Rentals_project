from datetime import datetime
from app import db
import enum

class AssetType(enum.Enum):
    YACHT = "yacht"
    CAR = "car"
    JET = "jet"
    OTHER = "other"

class Asset(db.Model):
    __tablename__ = 'assets'
    
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    asset_type = db.Column(db.Enum(AssetType), nullable=False)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    year = db.Column(db.Integer)
    capacity = db.Column(db.Integer)  # Number of people
    price_per_day = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships - FIXED
    owner = db.relationship("User", backref="owned_assets")
    images = db.relationship("AssetImage", back_populates="asset", cascade="all, delete-orphan", lazy='joined', order_by="desc(AssetImage.is_primary)")
    
    def to_dict(self):
        """Convert asset object to dictionary"""
        # Sort images to ensure primary image is first, then by ID for consistent order
        sorted_images = sorted(self.images, key=lambda x: (not x.is_primary, x.id))
        
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'title': self.title,
            'description': self.description,
            'asset_type': self.asset_type.value if self.asset_type else None,
            'brand': self.brand,
            'model': self.model,
            'year': self.year,
            'capacity': self.capacity,
            'price_per_day': self.price_per_day,
            'location': self.location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'images': [img.to_dict() for img in sorted_images]
        }
    
    def __repr__(self):
        return f'<Asset {self.title}>'

class AssetImage(db.Model):
    __tablename__ = 'asset_images'
    
    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    
    # Relationships - FIXED
    asset = db.relationship("Asset", back_populates="images")
    
    def to_dict(self):
        return {
            'id': self.id,
            'asset_id': self.asset_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary
        }
    
    def __repr__(self):
        return f'<AssetImage {self.image_url}>'