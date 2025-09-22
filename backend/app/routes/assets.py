from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.asset import Asset, AssetType, AssetImage
from app.models.user import User

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/', methods=['GET'])
def get_assets():
    """Get all available assets with optional filtering"""
    try:
        # Get query parameters for filtering
        asset_type = request.args.get('type')
        location = request.args.get('location')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        # Build query
        query = Asset.query.filter_by(is_available=True)
        
        if asset_type:
            try:
                asset_type_enum = AssetType(asset_type)
                query = query.filter_by(asset_type=asset_type_enum)
            except ValueError:
                return jsonify({'error': 'Invalid asset type'}), 400
        
        if location:
            query = query.filter(Asset.location.ilike(f'%{location}%'))
        
        if min_price:
            query = query.filter(Asset.price_per_day >= min_price)
        
        if max_price:
            query = query.filter(Asset.price_per_day <= max_price)
        
        assets = query.all()
        
        return jsonify({
            'assets': [asset.to_dict() for asset in assets],
            'count': len(assets)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/<int:asset_id>', methods=['GET'])
def get_asset(asset_id):
    """Get a specific asset by ID"""
    try:
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        return jsonify({'asset': asset.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/', methods=['POST'])
@jwt_required()
def create_asset():
    """Create a new asset (owners only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Check if user can create assets (must be owner or both)
        if user.user_type.value not in ['owner', 'both']:
            return jsonify({'error': 'Only owners can create assets'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'asset_type', 'price_per_day', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate asset type
        try:
            asset_type = AssetType(data['asset_type'])
        except ValueError:
            return jsonify({'error': 'Invalid asset type'}), 400
        
        # Create new asset
        asset = Asset(
            owner_id=user_id,
            title=data['title'],
            description=data.get('description'),
            asset_type=asset_type,
            brand=data.get('brand'),
            model=data.get('model'),
            year=data.get('year'),
            capacity=data.get('capacity'),
            price_per_day=data['price_per_day'],
            location=data['location'],
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        
        db.session.add(asset)
        db.session.commit()
        
        return jsonify({
            'message': 'Asset created successfully',
            'asset': asset.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/<int:asset_id>', methods=['PUT'])
@jwt_required()
def update_asset(asset_id):
    """Update an asset (owner only)"""
    try:
        user_id = get_jwt_identity()
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        if asset.owner_id != user_id:
            return jsonify({'error': 'You can only update your own assets'}), 403
        
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            asset.title = data['title']
        if 'description' in data:
            asset.description = data['description']
        if 'asset_type' in data:
            try:
                asset.asset_type = AssetType(data['asset_type'])
            except ValueError:
                return jsonify({'error': 'Invalid asset type'}), 400
        if 'brand' in data:
            asset.brand = data['brand']
        if 'model' in data:
            asset.model = data['model']
        if 'year' in data:
            asset.year = data['year']
        if 'capacity' in data:
            asset.capacity = data['capacity']
        if 'price_per_day' in data:
            asset.price_per_day = data['price_per_day']
        if 'location' in data:
            asset.location = data['location']
        if 'latitude' in data:
            asset.latitude = data['latitude']
        if 'longitude' in data:
            asset.longitude = data['longitude']
        if 'is_available' in data:
            asset.is_available = data['is_available']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Asset updated successfully',
            'asset': asset.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/my-assets', methods=['GET'])
@jwt_required()
def get_my_assets():
    """Get all assets owned by the current user"""
    try:
        user_id = get_jwt_identity()
        assets = Asset.query.filter_by(owner_id=user_id).all()
        
        return jsonify({
            'assets': [asset.to_dict() for asset in assets],
            'count': len(assets)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500