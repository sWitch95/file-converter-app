# QuickConvert

A modern, responsive file converter web application that supports multiple file formats including PDF, Word, PowerPoint, CSV, JSON, and images. Now with built-in image editing and file merging capabilities!

![QuickConvert Logo](public/logo.jpg)

## Features

### File Conversion
- **Multiple Format Support**: Convert between PDF, DOCX, PPTX, CSV, JSON, PNG, and JPG
- **Browser-Based Conversion**: Images and CSV/JSON convert instantly in your browser
- **Drag & Drop Interface**: Easy-to-use file upload with drag-and-drop support

### Image Editing ✨ NEW
- **Brightness & Contrast**: Adjust image brightness and contrast in real-time
- **Saturation Control**: Modify color saturation
- **Rotation**: Rotate images by 90-degree increments
- **Scaling**: Resize images from 10% to 200%
- **Live Preview**: See changes instantly on canvas

### File Merging ✨ NEW
- **Image Merger**: Combine multiple images into one
  - Horizontal layout
  - Vertical layout
  - Grid layout (2x2)
  - Adjustable spacing
- **PDF Merger**: Merge multiple PDFs into a single document
  - Reorder pages with drag controls
  - Browser-based processing with pdf-lib
  - No server upload required

### General Features
- **Bilingual UI**: Interface in both Bangla and English
- **Dark/Light Theme**: Toggle between dark and light modes
- **Privacy-Focused**: 100% browser-based - files never leave your device
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **TypeScript** - Type-safe development

### Backend (Node.js)
- **Express** - Web application framework
- **Multer** - File upload handling
- **Sharp** - Image processing
- **csvtojson & json2csv** - CSV/JSON conversion
- **LibreOffice** - Office document conversion

### Backend (Python - Alternative)
- **FastAPI** - Modern Python web framework
- **Pandas** - Data manipulation
- **Pillow** - Image processing
- **pypandoc** - Document conversion

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing

## Getting Started

### Prerequisites

- Node.js 18+ (for frontend and Node.js backend)
- Python 3.11+ (for FastAPI backend, optional)
- Docker & Docker Compose (for containerized deployment)

### Local Development

#### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/quickconvert.git
cd quickconvert
\`\`\`

#### 2. Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

#### 3. Run Frontend Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

**Note:** The browser-based version includes:
- ✅ Image conversion (PNG ↔ JPG)
- ✅ CSV/JSON conversion
- ✅ Image editing (brightness, contrast, saturation, rotation, scaling)
- ✅ Image merging (horizontal, vertical, grid layouts)
- ✅ PDF merging (using pdf-lib)
- ⚠️ PDF/Office conversions (demo mode - requires backend server)

#### 4. Run Backend Server (Optional - for PDF/Office conversions)

**Node.js Backend:**
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

The API will be available at `http://localhost:3001`

**FastAPI Backend (Alternative):**
\`\`\`bash
cd fastapi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`

The API will be available at `http://localhost:8000`

### Docker Deployment

#### Build and Run with Docker Compose

\`\`\`bash
docker-compose up --build
\`\`\`

This will start:
- Frontend (Next.js) on port 3000
- Backend API (Express) on port 3001
- Nginx reverse proxy on port 80

Access the application at `http://localhost`

#### Individual Container Builds

**Frontend:**
\`\`\`bash
docker build -t quickconvert-web .
docker run -p 3000:3000 quickconvert-web
\`\`\`

**Backend:**
\`\`\`bash
cd server
docker build -t quickconvert-api .
docker run -p 3001:3001 quickconvert-api
\`\`\`

## Project Structure

\`\`\`
quickconvert/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── convert/          # File conversion endpoint
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles and theme
│   ├── icon.tsx              # Favicon generator
│   └── apple-icon.tsx        # Apple touch icon
├── components/               # React components
│   ├── file-converter.tsx    # Main converter component with tabs
│   ├── image-editor.tsx      # Image editing component ✨ NEW
│   ├── image-merger.tsx      # Image merging component ✨ NEW
│   ├── pdf-merger.tsx        # PDF merging component ✨ NEW
│   ├── logo.tsx              # Logo component
│   ├── theme-provider.tsx    # Theme context provider
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utility functions
│   └── converters.ts         # Browser-based conversion utilities
├── server/                   # Node.js backend (optional)
│   ├── index.js              # Express server
│   ├── converters/           # Conversion logic
│   │   ├── index.js          # Main converter router
│   │   ├── image-converter.js
│   │   ├── csv-json-converter.js
│   │   └── office-converter.js
│   ├── __tests__/            # Backend tests
│   ├── package.json
│   └── Dockerfile
├── fastapi/                  # Python FastAPI backend (alternative)
│   ├── main.py               # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
├── public/                   # Static assets
│   ├── logo.jpg
│   ├── favicon.jpg
│   └── branding.html         # Branding guidelines
├── docker-compose.yml        # Docker orchestration
├── nginx.conf                # Nginx configuration
└── README.md                 # This file
\`\`\`

## API Documentation

### POST /api/convert

Convert a file from one format to another.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File to convert (required)
  - `format`: Conversion format (required)

**Supported Formats:**
- `pdf-to-docx`
- `docx-to-pdf`
- `pdf-to-pptx`
- `pptx-to-pdf`
- `csv-to-json`
- `json-to-csv`
- `png-to-jpg`
- `jpg-to-png`

**Response:**
\`\`\`json
{
  "success": true,
  "downloadUrl": "/api/download/filename.ext",
  "message": "File converted successfully"
}
\`\`\`

### GET /api/download/:filename

Download a converted file.

**Request:**
- Method: `GET`
- URL Parameter: `filename` - Name of the converted file

**Response:**
- File download stream

### GET /health

Health check endpoint.

**Response:**
\`\`\`json
{
  "status": "ok",
  "message": "QuickConvert API is running"
}
\`\`\`

## Testing

### Frontend Tests

\`\`\`bash
npm test
\`\`\`

### Backend Tests (Node.js)

\`\`\`bash
cd server
npm test
\`\`\`

### Backend Tests (FastAPI)

\`\`\`bash
cd fastapi
pytest
\`\`\`

## Environment Variables

### Frontend (.env.local)

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

### Backend (server/.env)

\`\`\`env
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=52428800
FILE_RETENTION_HOURS=24
\`\`\`

## Scaling Considerations

### For Production Deployment:

1. **Queue System**: Implement Bull/Redis for handling large file conversions asynchronously
2. **File Size Limits**: Configure nginx `client_max_body_size` based on your needs
3. **Streaming**: Use streaming for large file conversions instead of in-memory processing
4. **CDN**: Serve static assets through a CDN
5. **Load Balancing**: Use multiple backend instances behind a load balancer
6. **Storage**: Consider using cloud storage (S3, Google Cloud Storage) instead of local filesystem
7. **Monitoring**: Add application monitoring (Sentry, DataDog, etc.)
8. **Rate Limiting**: Implement rate limiting to prevent abuse
9. **WebAssembly**: Consider WASM for more complex browser-based conversions
10. **Service Workers**: Add offline support with service workers

## Security

- Files are processed locally in the browser when possible
- Files transferred to backend use TLS encryption
- No human access to uploaded files
- Automatic file deletion after 24 hours (backend only)
- Input validation on all file uploads
- File size limits enforced
- CORS configured for API endpoints
- CSP headers for XSS protection

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

**QuickConvert** - Convert, edit, and merge files quickly, securely, and free. 🚀
