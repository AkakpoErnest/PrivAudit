# PrivAudit Deployment Guide

## 🚀 Deploy to Vercel

### Method 1: Direct App Deployment (Recommended)

1. **In Vercel Dashboard:**
   - Import from GitHub: `AkakpoErnest/PrivAudit`
   - Set **Root Directory** to: `apps/web`
   - Set **Framework Preset** to: `Next.js`
   - Set **Build Command** to: `npm run build`
   - Set **Output Directory** to: `.next`

2. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_ETHERSCAN_API_KEY=Q6YZDT1G1VKR69J91FUBNI5WR9JSCXQRY9
   NEXT_PUBLIC_AI_API_KEY=your_claude_api_key
   ```

### Method 2: Monorepo Deployment

If Method 1 doesn't work, use the vercel.json configuration:

1. **In Vercel Dashboard:**
   - Import from GitHub: `AkakpoErnest/PrivAudit`
   - Set **Root Directory** to: `.` (project root)
   - Set **Framework Preset** to: `Other`
   - Set **Build Command** to: `npm run build:packages && cd apps/web && npm run build`
   - Set **Output Directory** to: `apps/web/.next`

## 🛠️ Local Testing

Test the build locally first:

```bash
# Build packages
npm run build:packages

# Build web app
cd apps/web && npm run build

# Test production build
npm run start
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build fails with package imports:**
   - Use Method 1 (deploy apps/web directly)
   - This avoids monorepo complexity

2. **Environment variables not working:**
   - Make sure they're added in Vercel dashboard
   - Use `NEXT_PUBLIC_` prefix for client-side variables

3. **API routes not working:**
   - Check that functions are in `apps/web/src/pages/api/`
   - Verify Node.js runtime version

### Environment Variables Needed:

- `NEXT_PUBLIC_ETHERSCAN_API_KEY` - For blockchain data fetching
- `NEXT_PUBLIC_AI_API_KEY` - For AI report generation (optional)

## 📝 Deployment Checklist

- [ ] GitHub repository pushed with latest changes
- [ ] Vercel project configured with correct settings
- [ ] Environment variables added
- [ ] Build command tested locally
- [ ] Domain configured (if custom domain needed)

## 🎯 Recommended Approach

**Use Method 1** - Deploy `apps/web` directly as a Next.js app. This avoids monorepo complexity and works most reliably with Vercel.
