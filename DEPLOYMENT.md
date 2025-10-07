# QuickConvert Deployment Guide

This guide covers various deployment options for QuickConvert.

## Table of Contents

1. [Vercel Deployment](#vercel-deployment)
2. [Docker Deployment](#docker-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Environment Variables](#environment-variables)
5. [Production Checklist](#production-checklist)

---

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/quickconvert.git
   git push -u origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` pointing to your backend API

4. **Deploy Backend Separately**
   - Deploy the Express backend to a separate service (Railway, Render, etc.)
   - Update `NEXT_PUBLIC_API_URL` with the backend URL

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## Docker Deployment

### Local Docker

\`\`\`bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Production Docker

1. **Build Production Images**
   \`\`\`bash
   docker build -t quickconvert-web:latest .
   docker build -t quickconvert-api:latest ./server
   \`\`\`

2. **Push to Registry**
   \`\`\`bash
   docker tag quickconvert-web:latest your-registry/quickconvert-web:latest
   docker push your-registry/quickconvert-web:latest
   
   docker tag quickconvert-api:latest your-registry/quickconvert-api:latest
   docker push your-registry/quickconvert-api:latest
   \`\`\`

3. **Deploy to Server**
   \`\`\`bash
   docker pull your-registry/quickconvert-web:latest
   docker pull your-registry/quickconvert-api:latest
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

---

## AWS Deployment

### Using AWS ECS (Elastic Container Service)

1. **Create ECR Repositories**
   \`\`\`bash
   aws ecr create-repository --repository-name quickconvert-web
   aws ecr create-repository --repository-name quickconvert-api
   \`\`\`

2. **Push Images to ECR**
   \`\`\`bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
   
   docker tag quickconvert-web:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/quickconvert-web:latest
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/quickconvert-web:latest
   \`\`\`

3. **Create ECS Cluster**
   - Use AWS Console or CLI to create an ECS cluster
   - Create task definitions for web and api services
   - Create services and configure load balancer

4. **Configure EFS for File Storage**
   - Create an EFS file system
   - Mount to ECS tasks for persistent file storage

### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   \`\`\`bash
   pip install awsebcli
   \`\`\`

2. **Initialize Application**
   \`\`\`bash
   eb init -p docker quickconvert
   \`\`\`

3. **Create Environment**
   \`\`\`bash
   eb create quickconvert-prod
   \`\`\`

4. **Deploy**
   \`\`\`bash
   eb deploy
   \`\`\`

---

## Environment Variables

### Frontend (.env.production)

\`\`\`env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
\`\`\`

### Backend (server/.env)

\`\`\`env
PORT=3001
NODE_ENV=production
MAX_FILE_SIZE=52428800
FILE_RETENTION_HOURS=24
CORS_ORIGIN=https://yourdomain.com
\`\`\`

---

## Production Checklist

### Security
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Implement file size limits
- [ ] Add input validation
- [ ] Enable security headers
- [ ] Use environment variables for secrets

### Performance
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression (gzip/brotli)
- [ ] Set up database connection pooling
- [ ] Implement queue system for large files

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure application monitoring
- [ ] Set up log aggregation
- [ ] Create health check endpoints
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### Backup & Recovery
- [ ] Set up automated backups
- [ ] Test restore procedures
- [ ] Document recovery process
- [ ] Set up file retention policy

### Scaling
- [ ] Configure auto-scaling
- [ ] Set up load balancing
- [ ] Implement horizontal scaling
- [ ] Use managed database services
- [ ] Consider serverless options

### Documentation
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbooks for common issues
- [ ] Document environment setup

---

## Troubleshooting

### Common Issues

**Issue: File uploads failing**
- Check nginx `client_max_body_size` setting
- Verify multer file size limits
- Check disk space on server

**Issue: Conversions timing out**
- Increase nginx `proxy_read_timeout`
- Implement queue system for long-running conversions
- Check LibreOffice installation

**Issue: Files not being deleted**
- Verify cron job is running
- Check file permissions
- Review cleanup logs

---

## Support

For deployment issues, please open an issue on GitHub or contact support.
\`\`\`
