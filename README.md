# QuickConvert

A modern, responsive file converter web application that supports multiple file formats including PDF, Word, PowerPoint, CSV, JSON, and images. Now with advanced image editing, file merging, and cloud integration!

![QuickConvert Logo](public/logo.jpg)

## Features

### File Conversion
- **Multiple Format Support**: 
  - Images: PNG, JPG, WebP, BMP, GIF
  - Data: CSV, JSON, XML, XLSX
  - Documents: PDF, DOCX, PPTX (demo mode)
- **Browser-Based Conversion**: Images and data formats convert instantly in your browser
- **Drag & Drop Interface**: Easy-to-use file upload with drag-and-drop support

### Image Editing ✨ NEW
- **Color Adjustments**: Brightness, Contrast, Saturation, Hue controls
- **Effects**: Blur and Sepia effects
- **Transformations**: Rotation and scaling (10%-200%)
- **Presets**: Grayscale, Vintage, Vivid, Cool, Warm filters
- **Text Overlay**: Add customizable text with size control
- **Compression Control**: Adjust output quality
- **Live Preview**: See changes instantly on canvas

### File Merging ✨ ENHANCED
- **Image Merger**: Combine multiple images into one
  - Horizontal, Vertical, 2x2 Grid, 3x3 Grid layouts
  - Drag-and-drop reordering
  - Adjustable spacing (0-50px)
  - Custom background color
- **PDF Merger**: Merge multiple PDFs into a single document
  - Reorder pages with drag controls
  - Drag-and-drop file reordering
  - Browser-based processing with pdf-lib
  - No server upload required

### Cloud Features ✨ NEW
- **Conversion History**: Track your last 50 conversions
- **User Preferences**: Save theme and compression settings
- **Supabase Integration**: Secure cloud storage with Row Level Security
- **Authentication**: Optional sign-in for personalized experience

### General Features
- **Bilingual UI**: Interface in both Bangla and English
- **Dark/Light Theme**: Toggle between dark and light modes
- **Privacy-Focused**: 100% browser-based - files never leave your device
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **TypeScript** - Type-safe development

### Database & Auth (Optional)
- **Supabase** - PostgreSQL with Row Level Security
- **Supabase Auth** - Email/password authentication

### Backend (Node.js - Optional)
- **Express** - Web application framework
- **Multer** - File upload handling
- **Sharp** - Image processing
- **csvtojson & json2csv** - CSV/JSON conversion

### Backend (Python - Optional)
- **FastAPI** - Modern Python web framework
- **Pandas** - Data manipulation
- **Pillow** - Image processing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing

## Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- Supabase account (optional, for cloud features)
- Docker & Docker Compose (optional, for containerized deployment)

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

#### 3. Setup Environment Variables (Optional)

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` to add Supabase credentials if you want cloud features:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

#### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

**Working Features (Browser-Based):**
- ✅ Image conversion (PNG, JPG, WebP, BMP, GIF)
- ✅ CSV/JSON/XML conversion
- ✅ Image editing (all effects and adjustments)
- ✅ Image merging (all layouts with reordering)
- ✅ PDF merging
- ⚠️ PDF/Office conversions (demo mode - requires backend)

### Docker Deployment

#### Build and Run with Docker Compose

\`\`\`bash
docker-compose up --build
\`\`\`

This will start:
- Frontend (Next.js) on port 3000
- Backend API (Express) on port 3001
- Nginx reverse proxy on port 80

Access the application at \`http://localhost\`

## Project Structure

\`\`\`
quickconvert/
├── app/                           # Next.js app directory
│   ├── api/                       # API routes
│   │   └── convert/               # File conversion endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles and theme
│   ├── icon.tsx                   # Favicon generator
│   └── apple-icon.tsx             # Apple touch icon
├── components/                    # React components
│   ├── file-converter.tsx         # Main converter with tabs
│   ├── image-editor.tsx           # Image editing ✨ ENHANCED
│   ├── image-merger.tsx           # Image merging ✨ ENHANCED
│   ├── pdf-merger.tsx             # PDF merging ✨ ENHANCED
│   ├── conversion-history.tsx     # Cloud history ✨ NEW
│   ├── logo.tsx                   # Logo component
│   ├── theme-provider.tsx         # Theme context provider
│   └── ui/                        # shadcn/ui components
├── lib/                           # Utilities
│   ├── converters.ts              # Enhanced conversion logic
│   └── supabase-client.ts         # Supabase client ✨ NEW
├── scripts/                       # Database setup
│   └── init-supabase.sql          # Schema and RLS policies ✨ NEW
├── public/                        # Static assets
│   ├── logo.jpg
│   ├── favicon.jpg
│   └── branding.html
├── server/                        # Node.js backend (optional)
│   ├── index.js
│   ├── converters/
│   └── Dockerfile
├── fastapi/                       # FastAPI backend (optional)
│   ├── main.py
│   └── requirements.txt
├── docker-compose.yml
├── vercel.json                    # Vercel config ✨ NEW
└── README.md                      # This file
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Environment variables needed:**
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

### Self-Host with Docker

\`\`\`bash
docker-compose up -d
\`\`\`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Supported Formats

### Image Conversions
- PNG → JPG, WebP, BMP
- JPG → PNG, WebP, BMP  
- WebP → PNG, JPG
- BMP → PNG, JPG
- GIF → PNG

### Data Conversions
- CSV → JSON, XML
- JSON → CSV, XLSX

### Document Conversions (Demo)
- PDF ↔ Word
- PDF ↔ PowerPoint

## Testing

\`\`\`bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
\`\`\`

## Environment Variables

### Frontend (.env.local)

\`\`\`env
# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
\`\`\`

## Security

- **Cloud Security**: Row-level security policies for user data
- **Data Privacy**: Automatic cleanup of user data
- **Encryption**: TLS for all data transmission

## Roadmap

- [ ] OCR text extraction
- [ ] Audio format conversion
- [ ] Video format conversion  
- [ ] Batch processing queue
- [ ] REST API for developers
- [ ] Mobile app
- [ ] Real-time collaboration

## Performance

- Page Load: < 2s
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Support

For issues and questions, please open an issue on GitHub.

---

**QuickConvert** - Convert, edit, and merge files quickly, securely, and free. 🚀
</merged_code
