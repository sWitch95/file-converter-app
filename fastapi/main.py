from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from pathlib import Path
import pandas as pd
from PIL import Image
import json
from datetime import datetime, timedelta
import asyncio

app = FastAPI(title="QuickConvert API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = Path("/tmp/uploads")
OUTPUT_DIR = Path("/tmp/outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "QuickConvert FastAPI is running"}

@app.post("/api/convert")
async def convert_file(
    file: UploadFile = File(...),
    format: str = Form(...)
):
    try:
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        input_filename = f"{timestamp}_{file.filename}"
        input_path = UPLOAD_DIR / input_filename
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse format
        source_format, target_format = format.split("-to-")
        
        # Perform conversion
        output_path = await perform_conversion(
            input_path, source_format, target_format
        )
        
        # Generate download URL
        output_filename = output_path.name
        download_url = f"/api/download/{output_filename}"
        
        return {
            "success": True,
            "downloadUrl": download_url,
            "message": "File converted successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    file_path = OUTPUT_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

async def perform_conversion(input_path: Path, source: str, target: str) -> Path:
    """Perform file conversion based on format"""
    
    output_filename = f"{input_path.stem}.{target}"
    output_path = OUTPUT_DIR / output_filename
    
    # CSV to JSON
    if source == "csv" and target == "json":
        df = pd.read_csv(input_path)
        df.to_json(output_path, orient="records", indent=2)
    
    # JSON to CSV
    elif source == "json" and target == "csv":
        with open(input_path, "r") as f:
            data = json.load(f)
        df = pd.DataFrame(data if isinstance(data, list) else [data])
        df.to_csv(output_path, index=False)
    
    # Image conversions
    elif source in ["png", "jpg"] and target in ["png", "jpg"]:
        img = Image.open(input_path)
        if target == "jpg":
            img = img.convert("RGB")
            img.save(output_path, "JPEG", quality=90)
        else:
            img.save(output_path, "PNG")
    
    # Office conversions (mock for now)
    else:
        # In production, use pypandoc or python-docx
        with open(output_path, "w") as f:
            f.write(f"Mock conversion from {source} to {target}\n")
            f.write(f"Original file: {input_path.name}\n")
    
    return output_path

# Cleanup task
async def cleanup_old_files():
    """Remove files older than 24 hours"""
    while True:
        await asyncio.sleep(3600)  # Run every hour
        
        cutoff_time = datetime.now() - timedelta(hours=24)
        
        for directory in [UPLOAD_DIR, OUTPUT_DIR]:
            for file_path in directory.iterdir():
                if file_path.is_file():
                    file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
                    if file_time < cutoff_time:
                        file_path.unlink()
                        print(f"Deleted old file: {file_path.name}")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(cleanup_old_files())
