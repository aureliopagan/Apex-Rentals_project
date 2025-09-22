from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app import db
from app.models.review import Review
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.models.asset import Asset

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    """Create a new review after a completed booking"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['booking_id', 'reviewee_id', 'rating', 'review_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate rating
        if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
        
        # Validate review type
        if data['review_type'] not in ['asset', 'user']:
            return jsonify({'error': 'Review type must be "asset" or "user"'}), 400
        
        # Get booking
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.client_id != user_id and booking.owner_id != user_id:
            return jsonify({'error': 'You can only review bookings you were involved in'}), 403
        
        # Check if booking is completed
        if booking.status != BookingStatus.COMPLETED:
            return jsonify({'error': 'You can only review completed bookings'}), 400
        
        # Validate reviewee
        reviewee = User.query.get(data['reviewee_id'])
        if not reviewee:
            return jsonify({'error': 'Reviewee not found'}), 404
        
        # Check if reviewee is involved in the booking
        if data['reviewee_id'] not in [booking.client_id, booking.owner_id]:
            return jsonify({'error': 'You can only review people involved in this booking'}), 400
        
        # Check if user is trying to review themselves
        if user_id == data['reviewee_id']:
            return jsonify({'error': 'You cannot review yourself'}), 400
        
        # Check if review already exists
        existing_review = Review.query.filter_by(
            booking_id=data['booking_id'],
            reviewer_id=user_id,
            reviewee_id=data['reviewee_id'],
            review_type=data['review_type']
        ).first()
        
        if existing_review:
            return jsonify({'error': 'You have already reviewed this booking'}), 400
        
        # Create review
        review = Review(
            booking_id=data['booking_id'],
            reviewer_id=user_id,
            reviewee_id=data['reviewee_id'],
            asset_id=booking.asset_id,
            rating=data['rating'],
            comment=data.get('comment'),
            review_type=data['review_type']
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review.to_dict(include_relations=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/asset/<int:asset_id>', methods=['GET'])
def get_asset_reviews(asset_id):
    """Get all reviews for a specific asset"""
    try:
        asset = Asset.query.get(asset_id)
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        reviews = Review.query.filter_by(
            asset_id=asset_id,
            review_type='asset'
        ).order_by(Review.created_at.desc()).all()
        
        # Calculate average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(
            asset_id=asset_id,
            review_type='asset'
        ).scalar()
        
        return jsonify({
            'asset_id': asset_id,
            'reviews': [review.to_dict(include_relations=True) for review in reviews],
            'total_reviews': len(reviews),
            'average_rating': round(float(avg_rating), 1) if avg_rating else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    """Get all reviews for a specific user"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        reviews = Review.query.filter_by(
            reviewee_id=user_id,
            review_type='user'
        ).order_by(Review.created_at.desc()).all()
        
        # Calculate average rating
        avg_rating = db.session.query(func.avg(Review.rating)).filter_by(
            reviewee_id=user_id,
            review_type='user'
        ).scalar()
        
        return jsonify({
            'user_id': user_id,
            'reviews': [review.to_dict(include_relations=True) for review in reviews],
            'total_reviews': len(reviews),
            'average_rating': round(float(avg_rating), 1) if avg_rating else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/my-reviews', methods=['GET'])
@jwt_required()
def get_my_reviews():
    """Get reviews given and received by the current user"""
    try:
        user_id = get_jwt_identity()
        
        # Reviews given by user
        reviews_given = Review.query.filter_by(reviewer_id=user_id).order_by(Review.created_at.desc()).all()
        
        # Reviews received by user
        reviews_received = Review.query.filter_by(reviewee_id=user_id).order_by(Review.created_at.desc()).all()
        
        # Calculate average rating received
        avg_rating_received = db.session.query(func.avg(Review.rating)).filter_by(
            reviewee_id=user_id
        ).scalar()
        
        return jsonify({
            'reviews_given': [review.to_dict(include_relations=True) for review in reviews_given],
            'reviews_received': [review.to_dict(include_relations=True) for review in reviews_received],
            'total_given': len(reviews_given),
            'total_received': len(reviews_received),
            'average_rating': round(float(avg_rating_received), 1) if avg_rating_received else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/booking/<int:booking_id>/eligible', methods=['GET'])
@jwt_required()
def check_review_eligibility(booking_id):
    """Check if user can review this booking and what reviews are possible"""
    try:
        user_id = get_jwt_identity()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.client_id != user_id and booking.owner_id != user_id:
            return jsonify({'error': 'You can only check review eligibility for your own bookings'}), 403
        
        # Check if booking is completed
        if booking.status != BookingStatus.COMPLETED:
            return jsonify({
                'can_review': False,
                'reason': 'Booking must be completed to leave reviews'
            }), 200
        
        # Determine who can be reviewed
        possible_reviews = []
        
        if user_id == booking.client_id:
            # Client can review owner and asset
            existing_user_review = Review.query.filter_by(
                booking_id=booking_id,
                reviewer_id=user_id,
                reviewee_id=booking.owner_id,
                review_type='user'
            ).first()
            
            existing_asset_review = Review.query.filter_by(
                booking_id=booking_id,
                reviewer_id=user_id,
                review_type='asset'
            ).first()
            
            if not existing_user_review:
                possible_reviews.append({
                    'type': 'user',
                    'reviewee_id': booking.owner_id,
                    'reviewee_name': f"{booking.owner.first_name} {booking.owner.last_name}",
                    'description': 'Review the asset owner'
                })
            
            if not existing_asset_review:
                possible_reviews.append({
                    'type': 'asset',
                    'reviewee_id': booking.owner_id,  # Still need reviewee_id for validation
                    'asset_name': booking.asset.title,
                    'description': 'Review the asset experience'
                })
        
        elif user_id == booking.owner_id:
            # Owner can review client
            existing_review = Review.query.filter_by(
                booking_id=booking_id,
                reviewer_id=user_id,
                reviewee_id=booking.client_id,
                review_type='user'
            ).first()
            
            if not existing_review:
                possible_reviews.append({
                    'type': 'user',
                    'reviewee_id': booking.client_id,
                    'reviewee_name': f"{booking.client.first_name} {booking.client.last_name}",
                    'description': 'Review the client'
                })
        
        return jsonify({
            'can_review': len(possible_reviews) > 0,
            'possible_reviews': possible_reviews,
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500