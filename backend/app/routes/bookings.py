from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models.booking import Booking, BookingStatus
from app.models.asset import Asset
from app.models.user import User

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    """Create a new booking"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Check if user can make bookings (must be client or both)
        if user.user_type.value not in ['client', 'both']:
            return jsonify({'error': 'Only clients can make bookings'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['asset_id', 'start_date', 'end_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get asset
        asset = Asset.query.get(data['asset_id'])
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        if not asset.is_available:
            return jsonify({'error': 'Asset is not available'}), 400
        
        # Parse dates
        try:
            start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Validate dates
        if start_date >= end_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        if start_date < datetime.now():
            return jsonify({'error': 'Start date cannot be in the past'}), 400
        
        # Check for conflicting bookings
        conflicting_bookings = Booking.query.filter(
            Booking.asset_id == data['asset_id'],
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            db.or_(
                db.and_(Booking.start_date <= start_date, Booking.end_date > start_date),
                db.and_(Booking.start_date < end_date, Booking.end_date >= end_date),
                db.and_(Booking.start_date >= start_date, Booking.end_date <= end_date)
            )
        ).first()
        
        if conflicting_bookings:
            return jsonify({'error': 'Asset is already booked for the selected dates'}), 400
        
        # Calculate total price
        total_days = (end_date - start_date).days
        if total_days == 0:
            total_days = 1  # Minimum 1 day
        total_price = total_days * asset.price_per_day
        
        # Create booking
        booking = Booking(
            client_id=user_id,
            owner_id=asset.owner_id,
            asset_id=data['asset_id'],
            start_date=start_date,
            end_date=end_date,
            total_price=total_price,
            special_requests=data.get('special_requests')
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_my_bookings():
    """Get bookings for the current user (both made and received)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get bookings made by user (as client)
        bookings_made = Booking.query.filter_by(client_id=user_id).all()
        
        # Get bookings received by user (as owner)
        bookings_received = Booking.query.filter_by(owner_id=user_id).all()
        
        return jsonify({
            'bookings_made': [booking.to_dict(include_relations=True) for booking in bookings_made],
            'bookings_received': [booking.to_dict(include_relations=True) for booking in bookings_received],
            'total_made': len(bookings_made),
            'total_received': len(bookings_received)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    """Get a specific booking"""
    try:
        user_id = get_jwt_identity()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.client_id != user_id and booking.owner_id != user_id:
            return jsonify({'error': 'You can only view your own bookings'}), 403
        
        return jsonify({'booking': booking.to_dict(include_relations=True)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    """Update booking status (owner can confirm/cancel, client can cancel)"""
    try:
        user_id = get_jwt_identity()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        try:
            new_status = BookingStatus(data['status'])
        except ValueError:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Check permissions
        if user_id == booking.owner_id:
            # Owner can confirm or cancel pending bookings
            if booking.status == BookingStatus.PENDING and new_status in [BookingStatus.CONFIRMED, BookingStatus.CANCELLED]:
                booking.status = new_status
            elif booking.status == BookingStatus.CONFIRMED and new_status == BookingStatus.COMPLETED:
                booking.status = new_status
            else:
                return jsonify({'error': 'Invalid status transition'}), 400
        elif user_id == booking.client_id:
            # Client can only cancel their own bookings
            if new_status == BookingStatus.CANCELLED and booking.status in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
                booking.status = new_status
            else:
                return jsonify({'error': 'Clients can only cancel bookings'}), 400
        else:
            return jsonify({'error': 'You can only update your own bookings'}), 403
        
        db.session.commit()
        
        return jsonify({
            'message': 'Booking status updated successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/asset/<int:asset_id>/availability', methods=['GET'])
def check_asset_availability(asset_id):
    """Check availability for an asset in a date range"""
    try:
        asset = Asset.query.get(asset_id)
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({'error': 'start_date and end_date are required'}), 400
        
        try:
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        # Check for conflicting bookings
        conflicting_bookings = Booking.query.filter(
            Booking.asset_id == asset_id,
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            db.or_(
                db.and_(Booking.start_date <= start_date, Booking.end_date > start_date),
                db.and_(Booking.start_date < end_date, Booking.end_date >= end_date),
                db.and_(Booking.start_date >= start_date, Booking.end_date <= end_date)
            )
        ).all()
        
        is_available = len(conflicting_bookings) == 0 and asset.is_available
        
        return jsonify({
            'asset_id': asset_id,
            'is_available': is_available,
            'conflicting_bookings': [booking.to_dict() for booking in conflicting_bookings]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500