# 🚀 UPSC Dashboard - Vercel Deployment Instructions

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Domain (Optional)** - For custom domain setup

## 🔧 Step 1: Prepare Your Repository

### 1.1 Environment Variables Setup
```bash
# Copy the example environment file
cp .env.example .env.local

# Generate a secure JWT secret
openssl rand -base64 32
```

### 1.2 Update Environment Variables
Edit `.env.local` with your production values:
```env
NODE_ENV=production
NEXTAUTH_SECRET=your-generated-secret-from-step-1.1
NEXTAUTH_URL=https://your-app-name.vercel.app
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### 1.3 Commit and Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🚀 Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **"upsc-dashboard"** folder if it's in a subdirectory

### 2.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
In Vercel dashboard, go to **Settings > Environment Variables** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `NEXTAUTH_SECRET` | `your-generated-secret` | Production |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `ADMIN_EMAIL` | `your-admin@email.com` | Production |
| `ADMIN_PASSWORD` | `your-secure-password` | Production |

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-app-name.vercel.app`

## 🌐 Step 3: Custom Domain Setup (Optional)

### 3.1 Add Domain in Vercel
1. Go to **Settings > Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 3.2 Update Environment Variables
Update `NEXTAUTH_URL` to your custom domain:
```env
NEXTAUTH_URL=https://your-custom-domain.com
```

### 3.3 Redeploy
Trigger a new deployment to apply domain changes.

## ✅ Step 4: Verify Deployment

### 4.1 Test Core Features
- [ ] Homepage loads correctly
- [ ] Authentication system works
- [ ] AI Assistant responds
- [ ] Practice Arena functions
- [ ] Maps page loads
- [ ] Learning Center accessible
- [ ] Question parsing works
- [ ] Multi-tenant features work

### 4.2 Performance Check
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🔧 Step 5: Post-Deployment Configuration

### 5.1 Admin Setup
1. Visit your deployed app
2. Register with your admin email
3. Verify admin privileges work
4. Create test tenant accounts

### 5.2 Content Upload
1. Upload study materials to Learning Center
2. Verify question parsing with PDF files
3. Test AI assistant with various commands

## 🛠️ Ongoing Maintenance

### Daily Tasks
- Monitor application performance
- Check error logs in Vercel dashboard
- Verify backup systems

### Weekly Tasks
- Review usage analytics
- Update content as needed
- Test new features before deployment

### Monthly Tasks
- Security audit
- Performance optimization review
- User feedback analysis

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run build  # Test locally first
npm run type-check  # Fix TypeScript errors
```

**Environment Variable Issues**
- Ensure all required variables are set
- Check for typos in variable names
- Verify secrets are properly generated

**Authentication Problems**
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is properly set
- Ensure admin credentials are correct

**Performance Issues**
- Enable Vercel Analytics
- Check bundle size in build logs
- Optimize images and assets

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Create issues in your repository

---

**🎉 Congratulations!** Your UPSC Dashboard is now live and accessible worldwide!
