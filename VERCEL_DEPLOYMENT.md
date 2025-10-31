# Deploying QuickConvert to Vercel

QuickConvert is a Next.js application that can be easily deployed to Vercel with zero configuration.

## Quick Start

### Option 1: Deploy with GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel automatically detects Next.js configuration
5. Set environment variables (see below)
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI

\`\`\`bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
vercel

# For production
vercel --prod
\`\`\`

## Environment Variables

Set these in your Vercel project settings or create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Configuration

The `vercel.json` file contains deployment configuration:
- Build command: `npm run build`
- Framework: Next.js
- Default region: IAD (US East)

## Performance Optimizations

- All file conversions are browser-based (no server computation needed)
- Images are optimized with Next.js Image component
- Code splitting and lazy loading enabled by default
- Automatic caching headers configured

## Monitoring

After deployment:
1. Go to your Vercel Dashboard
2. Select your QuickConvert project
3. View real-time analytics and logs
4. Monitor function executions and performance

## Custom Domain

To add a custom domain:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update your DNS records
4. Wait for verification (usually 5-10 minutes)

## Rollback

If you need to revert to a previous deployment:
1. Go to Deployments tab
2. Find the deployment you want to revert to
3. Click the three-dot menu
4. Select "Promote to Production"

## Troubleshooting

### Build fails
- Check that all dependencies are in package.json
- Ensure environment variables are properly set
- Check build logs in Vercel dashboard

### File conversions not working
- Verify browser compatibility (requires modern browsers)
- Check browser console for errors
- Ensure JavaScript is enabled

### Supabase integration issues
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies allow operations

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue on GitHub
