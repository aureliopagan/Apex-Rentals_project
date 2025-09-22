from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    jwt.init_app(app)
    
    # Import models (this ensures they're registered with SQLAlchemy)
    from app.models.user import User
    from app.models.asset import Asset, AssetImage
    from app.models.booking import Booking
    from app.models.review import Review
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.assets import assets_bp
    from app.routes.bookings import bookings_bp
    from app.routes.reviews import reviews_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    
    @app.route('/')
    def health_check():
        return {'message': 'Apex Rentals API is running!', 'status': 'healthy'}
    
    return app