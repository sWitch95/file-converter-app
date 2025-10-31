# Office Document Conversions Guide

## Current Status

Your QuickConvert app is running **100% in the browser** with no backend server. This is great for privacy but has limitations for complex office document conversions.

### What Works (Client-Side - Browser Only)
✅ Image conversions (PNG, JPG, WebP, BMP, GIF)
✅ Data conversions (CSV, JSON, XML, XLSX)
✅ Image editing and merging
✅ PDF merging
✅ **PDF to Text extraction** (newly added)

### What Requires Backend (Currently Demo Mode)
❌ PDF → Word (.docx)
❌ Word → PDF (.docx → .pdf)
❌ PDF → PowerPoint (.pptx)
❌ PowerPoint → PDF (.pptx → .pdf)

---

## Why Office Conversions Need Backend

These conversions require heavy libraries:
- **pdf-lib**: Works in browser (used for PDF merging) ✓
- **libreoffice/unoconv**: Requires server backend ✗
- **LibreOffice CLI**: Must run on server ✗

The libraries needed to convert Word ↔ PDF or PowerPoint ↔ PDF are too large for browser distribution and require system-level processes.

---

## Available Alternatives

### Option 1: Use PDF to Text (NEW - Works Now)
Instead of converting PDF to Word:
1. Use the new **"PDF → Text"** option to extract all text
2. Copy the text into Word/Google Docs manually
3. Re-format as needed

**Pros:** Free, instant, no backend needed
**Cons:** Loses formatting, requires manual cleanup

### Option 2: Deploy Backend Server

To enable full office conversions, deploy the Express server:

\`\`\`bash
# 1. Install Node.js server dependencies
cd server
npm install

# 2. Run the server locally for testing
npm start

# 3. Connect frontend to backend by updating:
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

See `DEPLOYMENT.md` for Vercel deployment instructions.

### Option 3: Use Online Tools for Office Conversions
- **PDF to Word**: Use Smallpdf.com, ILovePDF.com, or PDF2Go
- **Word to PDF**: Native in Word/Google Docs (File → Download As → PDF)
- **PowerPoint conversions**: Use online converters or export directly

### Option 4: Hybrid Approach (Recommended)
Use QuickConvert for:
- ✅ All image conversions
- ✅ Data format conversions (CSV, JSON, XML)
- ✅ Image editing and merging
- ✅ PDF merging
- ✅ PDF text extraction

Use dedicated tools for:
- Office conversions (Word, PowerPoint)

---

## How to Enable Backend for Full Conversions

### Development (Local)
\`\`\`bash
# Terminal 1: Start Next.js frontend
npm run dev

# Terminal 2: Start Express backend
cd server && npm install && npm start
\`\`\`

### Production (Vercel)
See `DEPLOYMENT_GUIDE.md` for complete instructions:
1. Push your code to GitHub
2. Connect backend and frontend on Vercel
3. Set environment variables
4. Deploy both services

---

## Technical Details

### PDF Extraction (Works Now)
Uses `pdfjs-dist` to extract text from PDF files. Preserves paragraph structure but loses complex formatting.

### Office Conversions (Requires Backend)
Requires:
- LibreOffice (for .docx ↔ .pdf)
- Python libraries like `python-pptx` (for .pptx)
- Image processing for embedded media

These must run on a server with proper permissions and file system access.

---

## FAQ

**Q: Why can't I convert Word to PDF in the browser?**
A: Microsoft Office formats (.docx, .pptx) contain complex XML structures and embedded assets. Converting them reliably requires LibreOffice or specialized server libraries.

**Q: Can I use a free service instead?**
A: Yes! Services like Smallpdf, ILovePDF, and PDF2Go offer free conversions. QuickConvert is better for privacy and batch processing.

**Q: Will you add office conversions?**
A: You can deploy the Express backend included in your project. Full setup takes 5-10 minutes.

**Q: Why is PDF merging available if PDFs are complex?**
A: PDF merging only combines pages and doesn't require interpreting document structure. PDF text extraction similarly just reads content.

---

## Need Help?

1. **Local Development**: Run `npm run dev` and `cd server && npm start`
2. **Deployment**: Follow `DEPLOYMENT_GUIDE.md`
3. **Issues**: Check `README.md` for troubleshooting
