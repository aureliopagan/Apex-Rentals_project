import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
import io

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_image(image_file, max_size=(1200, 1200), quality=85):
    """Compress and resize image"""
    try:
        # Open image
        img = Image.open(image_file)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if larger than max_size
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        return output
    except Exception as e:
        print(f"Error compressing image: {e}")
        return None

def save_uploaded_file(file, upload_folder):
    """Save uploaded file and return filename"""
    if not file or not allowed_file(file.filename):
        return None
    
    # Create upload directory if it doesn't exist
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    name, ext = os.path.splitext(filename)
    unique_filename = f"{uuid.uuid4().hex[:8]}_{name}{ext}"
    
    filepath = os.path.join(upload_folder, unique_filename)
    
    try:
        # Compress image before saving
        compressed = compress_image(file)
        if compressed:
            with open(filepath, 'wb') as f:
                f.write(compressed.read())
            return unique_filename
        else:
            # Fallback: save original if compression fails
            file.save(filepath)
            return unique_filename
    except Exception as e:
        print(f"Error saving file: {e}")
        return None