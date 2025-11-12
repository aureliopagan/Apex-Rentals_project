from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models.booking import Booking, BookingStatus
from app.models.user import User

cleanup_bp = Blueprint('cleanup', __name__)

@cleanup_bp.route('/cleanup-expired', methods=['POST'])
@jwt_required()
def cleanup_expired_bookings():
    """Delete expired pending bookings (past start date)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Find all pending bookings with past start dates
        now = datetime.now()
        expired_bookings = Booking.query.filter(
            Booking.status == BookingStatus.PENDING,
            Booking.start_date < now
        ).all()
        
        deleted_count = len(expired_bookings)
        
        # Delete each expired booking
        for booking in expired_bookings:
            db.session.delete(booking)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Cleaned up {deleted_count} expired bookings',
            'deleted_count': deleted_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@cleanup_bp.route('/cleanup-my-expired', methods=['POST'])
@jwt_required()
def cleanup_my_expired_bookings():
    """Delete only the current user's expired pending bookings"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        now = datetime.now()
        
        # Find user's expired bookings (both as client and owner)
        if user.user_type.value == 'client':
            # For clients, delete their expired booking requests
            expired_bookings = Booking.query.filter(
                Booking.client_id == user_id,
                Booking.status == BookingStatus.PENDING,
                Booking.start_date < now
            ).all()
        else:
            # For owners, delete expired booking requests they received
            expired_bookings = Booking.query.filter(
                Booking.owner_id == user_id,
                Booking.status == BookingStatus.PENDING,
                Booking.start_date < now
            ).all()
        
        deleted_count = len(expired_bookings)
        
        # Delete each expired booking
        for booking in expired_bookings:
            db.session.delete(booking)
        
        db.session.commit()
        
        return jsonify({
            'message': f'Cleaned up {deleted_count} expired bookings',
            'deleted_count': deleted_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500