import os
import uuid
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder):
    """Save uploaded file and return the filename"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        
        # Get the absolute path to the backend directory
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        full_upload_path = os.path.join(backend_dir, upload_folder)
        
        # Create upload folder if it doesn't exist
        os.makedirs(full_upload_path, exist_ok=True)
        
        # Full file path
        filepath = os.path.join(full_upload_path, filename)
        
        print(f"[FILE_UPLOAD] Backend dir: {backend_dir}")
        print(f"[FILE_UPLOAD] Upload folder: {upload_folder}")
        print(f"[FILE_UPLOAD] Full upload path: {full_upload_path}")
        print(f"[FILE_UPLOAD] Saving file to: {filepath}")
        
        # Save the file
        file.save(filepath)
        
        # Verify file was saved
        if os.path.exists(filepath):
            file_size = os.path.getsize(filepath)
            print(f"[FILE_UPLOAD] File saved successfully: {filename} ({file_size} bytes)")
            return filename
        else:
            print(f"[FILE_UPLOAD] ERROR: File was not saved!")
            return None
    
    print(f"[FILE_UPLOAD] File not allowed or invalid: {file.filename if file else 'No file'}")
    return None