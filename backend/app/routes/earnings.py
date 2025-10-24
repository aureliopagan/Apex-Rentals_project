from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.asset import Asset
from app.models.booking import Booking, BookingStatus
from sqlalchemy import func

earnings_bp = Blueprint('earnings', __name__)

@earnings_bp.route('/', methods=['GET'])
@jwt_required()
def get_earnings():
    """Get earnings summary for asset owner"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.user_type.value != 'owner':
            return jsonify({'error': 'Only asset owners can view earnings'}), 403
        
        owned_assets = Asset.query.filter_by(owner_id=user_id).all()
        asset_ids = [asset.id for asset in owned_assets]
        
        if not asset_ids:
            return jsonify({
                'total_earnings': 0,
                'confirmed_earnings': 0,
                'pending_earnings': 0,
                'total_bookings': 0,
                'confirmed_bookings': 0,
                'pending_bookings': 0,
                'assets_breakdown': [],
                'recent_bookings': []
            }), 200
        
        all_bookings = Booking.query.filter(Booking.asset_id.in_(asset_ids)).all()
        
        total_earnings = sum(booking.total_price for booking in all_bookings)
        
        confirmed_bookings_list = [
            booking for booking in all_bookings 
            if booking.status in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]
        ]
        confirmed_earnings = sum(booking.total_price for booking in confirmed_bookings_list)
        
        pending_bookings_list = [
            booking for booking in all_bookings 
            if booking.status == BookingStatus.PENDING
        ]
        pending_earnings = sum(booking.total_price for booking in pending_bookings_list)
        
        assets_breakdown = []
        for asset in owned_assets:
            asset_bookings = [b for b in all_bookings if b.asset_id == asset.id]
            if asset_bookings:
                assets_breakdown.append({
                    'asset_id': asset.id,
                    'asset_title': asset.title,
                    'asset_type': asset.asset_type.value,
                    'total_bookings': len(asset_bookings),
                    'total_earnings': sum(b.total_price for b in asset_bookings)
                })
        
        assets_breakdown.sort(key=lambda x: x['total_earnings'], reverse=True)
        
        recent_bookings = sorted(all_bookings, key=lambda x: x.created_at, reverse=True)[:10]
        recent_bookings_data = []
        
        for booking in recent_bookings:
            asset = Asset.query.get(booking.asset_id)
            client = User.query.get(booking.client_id)
            recent_bookings_data.append({
                'id': booking.id,
                'asset_title': asset.title if asset else 'Unknown Asset',
                'asset_type': asset.asset_type.value if asset else 'unknown',
                'client_name': f"{client.first_name} {client.last_name}" if client else 'Unknown',
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'total_price': booking.total_price,
                'status': booking.status.value,
                'created_at': booking.created_at.isoformat()
            })
        
        return jsonify({
            'total_earnings': round(total_earnings, 2),
            'confirmed_earnings': round(confirmed_earnings, 2),
            'pending_earnings': round(pending_earnings, 2),
            'total_bookings': len(all_bookings),
            'confirmed_bookings': len(confirmed_bookings_list),
            'pending_bookings': len(pending_bookings_list),
            'assets_breakdown': assets_breakdown,
            'recent_bookings': recent_bookings_data
        }), 200
        
    except Exception as e:
        print(f"Error in get_earnings: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500