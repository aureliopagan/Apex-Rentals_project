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
    jwt.init_app(app)
    
    # Configure CORS - Allow all for development
    CORS(app)
    
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
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        from flask import send_from_directory
        return send_from_directory('uploads', filename)
    
    @app.route('/')
    def health_check():
        return {'message': 'Apex Rentals API is running!', 'status': 'healthy'}
    
    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return app