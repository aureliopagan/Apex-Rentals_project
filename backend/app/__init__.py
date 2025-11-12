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
    from app.routes.cleanup import cleanup_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(earnings_bp, url_prefix='/api/earnings')
    app.register_blueprint(cleanup_bp, url_prefix='/api/cleanup')
    
    @app.route('/uploads/assets/<filename>')
    def uploaded_file(filename):
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'assets')
        print(f"[UPLOAD] Trying to serve: {filename}")
        print(f"[UPLOAD] From directory: {upload_dir}")
        print(f"[UPLOAD] File exists: {os.path.exists(os.path.join(upload_dir, filename))}")
        return send_from_directory(upload_dir, filename)
    
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