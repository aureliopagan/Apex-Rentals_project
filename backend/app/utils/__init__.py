from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Get the absolute path to the backend directory
    BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_FOLDER = os.path.join(BACKEND_DIR, 'uploads')
    
    print(f"Backend directory: {BACKEND_DIR}")
    print(f"Upload folder: {UPLOAD_FOLDER}")
    
    # Create uploads directory if it doesn't exist
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'assets'), exist_ok=True)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    CORS(app)
    
    from app.models.user import User
    from app.models.asset import Asset, AssetImage
    from app.models.booking import Booking
    from app.models.review import Review
    
    from app.routes.auth import auth_bp
    from app.routes.assets import assets_bp
    from app.routes.bookings import bookings_bp
    from app.routes.reviews import reviews_bp
    from app.routes.earnings import earnings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(earnings_bp, url_prefix='/api/earnings')
    
    # Serve uploaded files - FIXED VERSION
    @app.route('/uploads/<path:subpath>')
    def serve_uploads(subpath):
        try:
            print(f"Attempting to serve file: {subpath}")
            print(f"Full path: {os.path.join(UPLOAD_FOLDER, subpath)}")
            
            if os.path.exists(os.path.join(UPLOAD_FOLDER, subpath)):
                print(f"File exists, serving...")
                return send_from_directory(UPLOAD_FOLDER, subpath)
            else:
                print(f"File not found: {os.path.join(UPLOAD_FOLDER, subpath)}")
                return {'error': 'File not found'}, 404
        except Exception as e:
            print(f"Error serving file: {e}")
            return {'error': str(e)}, 500
    
    @app.route('/')
    def health_check():
        return {'message': 'Apex Rentals API is running!', 'status': 'healthy'}
    
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    return app