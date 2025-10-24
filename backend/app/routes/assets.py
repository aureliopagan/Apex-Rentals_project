from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.asset import Asset, AssetType, AssetImage
from app.models.user import User
from app.utils.file_upload import save_uploaded_file
import os

assets_bp = Blueprint('assets', __name__)

UPLOAD_FOLDER = 'uploads/assets'

@assets_bp.route('/', methods=['GET'])
def get_assets():
    """Get all available assets with optional filtering"""
    try:
        asset_type = request.args.get('type')
        location = request.args.get('location')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        query = Asset.query.options(db.joinedload(Asset.images)).filter_by(is_available=True)
        
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
        
        print(f"[GET ASSETS] Found {len(assets)} available assets")
        for asset in assets:
            print(f"  - Asset {asset.id}: {asset.title} (available: {asset.is_available})")
        
        return jsonify({
            'assets': [asset.to_dict() for asset in assets],
            'count': len(assets)
        }), 200
        
    except Exception as e:
        print(f"Error in get_assets: {e}")
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
    """Create a new asset with image uploads (owners only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.user_type.value != 'owner':
            return jsonify({'error': 'Only owners can create assets'}), 403
        
        # Check if request has files
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
            files = request.files.getlist('images')
            print(f"[CREATE ASSET] Received {len(files)} image files")
            for idx, f in enumerate(files):
                print(f"[CREATE ASSET] File {idx}: {f.filename}, content_type: {f.content_type}")
        else:
            data = request.get_json()
            files = []
            print(f"[CREATE ASSET] No files in request")
        
        print(f"[CREATE ASSET] Received data: {data}")
        
        # Validate required fields
        required_fields = ['title', 'asset_type', 'price_per_day', 'location']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate asset type
        try:
            asset_type = AssetType(data['asset_type'])
        except ValueError:
            return jsonify({'error': 'Invalid asset type'}), 400
        
        # Create asset
        asset = Asset(
            owner_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            asset_type=asset_type,
            brand=data.get('brand', ''),
            model=data.get('model', ''),
            year=int(data['year']) if data.get('year') else None,
            capacity=int(data['capacity']) if data.get('capacity') else None,
            price_per_day=float(data['price_per_day']),
            location=data['location'],
            latitude=float(data['latitude']) if data.get('latitude') else None,
            longitude=float(data['longitude']) if data.get('longitude') else None,
            is_available=True
        )
        
        db.session.add(asset)
        db.session.flush()
        
        print(f"[CREATE ASSET] Created asset {asset.id} with is_available={asset.is_available}")
        
        # Handle image uploads
        uploaded_images = []
        for i, file in enumerate(files):
            if file and file.filename:
                print(f"[CREATE ASSET] Processing file {i}: {file.filename}")
                filename = save_uploaded_file(file, UPLOAD_FOLDER)
                if filename:
                    print(f"[CREATE ASSET] File saved as: {filename}")
                    asset_image = AssetImage(
                        asset_id=asset.id,
                        image_url=f'/uploads/assets/{filename}',
                        is_primary=(i == 0)
                    )
                    db.session.add(asset_image)
                    uploaded_images.append(filename)
                    print(f"[CREATE ASSET] Added image record: /uploads/assets/{filename}")
                else:
                    print(f"[CREATE ASSET] Failed to save file: {file.filename}")
        
        db.session.commit()
        
        print(f"[CREATE ASSET] Successfully committed asset {asset.id} with {len(uploaded_images)} images")
        
        # Verify the asset was saved with images
        saved_asset = Asset.query.get(asset.id)
        print(f"[CREATE ASSET] Verification - Asset {saved_asset.id}: is_available={saved_asset.is_available}, images={len(saved_asset.images)}")
        
        return jsonify({
            'message': 'Asset created successfully',
            'asset': asset.to_dict(),
            'images_uploaded': len(uploaded_images)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[CREATE ASSET] Error creating asset: {e}")
        import traceback
        traceback.print_exc()
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

@assets_bp.route('/debug', methods=['GET'])
def debug_assets():
    """Debug route to see all assets"""
    try:
        all_assets = Asset.query.all()
        result = []
        for asset in all_assets:
            result.append({
                'id': asset.id,
                'title': asset.title,
                'owner_id': asset.owner_id,
                'asset_type': asset.asset_type.value,
                'is_available': asset.is_available,
                'images_count': len(asset.images) if hasattr(asset, 'images') else 0
            })
        return jsonify({
            'total_assets': len(all_assets),
            'assets': result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/my-assets', methods=['GET'])
@jwt_required()
def get_my_assets():
    """Get all assets owned by the current user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        print(f"[GET MY ASSETS] User {user_id} ({user.user_type.value}) requesting their assets")
        
        assets = Asset.query.options(db.joinedload(Asset.images)).filter_by(owner_id=user_id).all()
        
        print(f"[GET MY ASSETS] Found {len(assets)} assets for user {user_id}")
        for asset in assets:
            print(f"[GET MY ASSETS] Asset: {asset.id} - {asset.title} - Available: {asset.is_available} - Images: {len(asset.images)}")
        
        return jsonify({
            'assets': [asset.to_dict() for asset in assets],
            'count': len(assets)
        }), 200
        
    except Exception as e:
        print(f"Error in get_my_assets: {e}")
        return jsonify({'error': str(e)}), 500

@assets_bp.route('/<int:asset_id>', methods=['DELETE'])
@jwt_required()
def delete_asset(asset_id):
    """Delete an asset (owner only)"""
    try:
        user_id = get_jwt_identity()
        asset = Asset.query.get(asset_id)
        
        if not asset:
            return jsonify({'error': 'Asset not found'}), 404
        
        if asset.owner_id != user_id:
            return jsonify({'error': 'You can only delete your own assets'}), 403
        
        db.session.delete(asset)
        db.session.commit()
        
        return jsonify({'message': 'Asset deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500