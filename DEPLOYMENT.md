# Deployment Instructions for F1Jobs.io Interview Prep Hub

## Repository Setup

### 1. Create New Repository in F1jobs-io Organization

1. Go to https://github.com/orgs/F1jobs-io/repositories
2. Click "New repository"
3. Configure the repository:
   - **Repository name**: `interview-prep-hub` (or your preferred name)
   - **Description**: "Interactive interview preparation platform for H-1B sponsorship candidates"
   - **Visibility**: Private (recommended) or Public
   - **Initialize**: Leave unchecked (we'll push existing code)

### 2. Push Code to Repository

```bash
# Add the new remote (replace REPO_NAME with your chosen repository name)
git remote add origin https://github.com/F1jobs-io/REPO_NAME.git

# Push the code
git push -u origin main
```

## GitHub Pages Setup

### 3. Enable GitHub Pages

1. Go to your repository settings: `https://github.com/F1jobs-io/REPO_NAME/settings`
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. The GitHub Actions workflow will automatically deploy your site

### 4. Access Your Site

After deployment completes (2-3 minutes), your site will be available at:
```
https://F1jobs-io.github.io/REPO_NAME/
```

## What's Configured

✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- Automatically deploys on every push to main branch
- Uses GitHub's official Pages actions
- Serves the `site/` directory as the web root

✅ **Jekyll Bypass** (`.nojekyll`)
- Ensures all files are served properly (including those starting with underscore)

✅ **Static Site Ready**
- No build process required
- All paths are relative and GitHub Pages compatible
- Assets, docs, and scripts properly linked

## Repository Structure for GitHub Pages

```
/
├── .github/workflows/deploy.yml  # Auto-deployment workflow
├── .nojekyll                     # Bypass Jekyll processing
├── site/                         # Web root directory
│   ├── index.html               # Main entry point
│   ├── app.js                   # Application logic
│   ├── styles.css               # Styling
│   ├── assets/                  # Static assets
│   └── docs/                    # Content pages
├── README.md                    # Project documentation
└── DEPLOYMENT.md               # This file
```

## Maintenance

- **Content Updates**: Edit files in `site/docs/` and push to main branch
- **Styling Changes**: Modify `site/styles.css` and push
- **New Features**: Update `site/app.js` and related files, then push
- **Automatic Deployment**: Every push to main triggers automatic redeployment

## Security Notes

- Repository can be private while GitHub Pages site is public
- No sensitive data is exposed (all content is static)
- No server-side processing or database connections
- User data stored locally in browser only

## Troubleshooting

1. **404 Error**: Check that repository name matches the URL path
2. **Assets Not Loading**: Verify all paths in code are relative (no leading `/`)
3. **Deployment Failed**: Check Actions tab for build errors
4. **CSS/JS Not Updating**: Clear browser cache or hard refresh (Ctrl+F5)

---

Your F1Jobs.io Interview Prep Hub is now ready for deployment! 🚀