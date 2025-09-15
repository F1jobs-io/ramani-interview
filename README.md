# F1Jobs.io Interview Prep Hub

A comprehensive, interactive interview preparation platform designed for international graduates seeking H-1B sponsorship opportunities. This prep hub provides role-specific guidance, mock interviews, and strategic preparation materials.

## 🚀 Features

- **Interactive Practice Mode**: Mock interviews with recording capabilities
- **Role-Specific Preparation**: Tailored content for Salesforce Administrator positions
- **Company Intelligence**: Detailed research and insights on target companies
- **Clinical Trial Context**: Specialized guidance for regulated industry roles
- **Theme Support**: Full light/dark mode compatibility
- **Notes & Bookmarks**: Personal annotation and progress tracking
- **Global Search**: Cross-document search functionality

## 📁 Project Structure

```
site/
├── index.html          # Main application entry point
├── app.js             # Core JavaScript functionality
├── styles.css         # Global styles and theme system
├── assets/            # Static assets (logos, images)
└── docs/              # Interview preparation content
    ├── welcome.html
    ├── company_profile.html
    ├── interview_prep.html
    ├── practice_mode.html
    └── [additional prep materials]
```

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties for theming
- **Storage**: LocalStorage for user preferences and notes
- **Search**: Client-side full-text search
- **Audio**: Web Audio API for practice recordings

## 🎯 Target Use Case

This platform is specifically designed for:
- International graduates on F-1 visas
- Candidates seeking H-1B sponsorship
- Salesforce professionals in clinical trial industries
- Interview preparation for regulated environments

## 🔧 Setup & Deployment

### Local Development
1. Clone the repository
2. Serve the `site/` directory with any HTTP server
3. Navigate to `index.html`

### GitHub Pages Deployment
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `main` branch `/site` folder
4. Access via provided GitHub Pages URL

## 🎨 Customization

### Theme System
- Modify CSS custom properties in `styles.css`
- Supports automatic light/dark mode detection
- User preference persistence via localStorage

### Content Updates
- All content is in HTML files within `docs/`
- Update `app.js` routes for new documents
- Add entries to global search index

### Branding
- Replace `assets/logo.svg` with custom logo
- Update brand colors in CSS custom properties
- Modify `index.html` title and metadata

## 📱 Features Overview

### Interactive Practice
- Timed and untimed practice modes
- Audio recording capabilities
- Progress tracking and confidence scoring
- Category-based question filtering

### Smart Navigation
- Sidebar navigation with sections
- Mobile-responsive design
- Bookmark system for quick access
- Notes panel with document-specific storage

### Search & Discovery
- Real-time document search
- Global search across all content
- Search result highlighting
- Quick navigation to relevant sections

## 🔐 Privacy & Security

- No external dependencies or tracking
- All data stored locally in browser
- No server-side processing required
- Private repository with public deployment

## 📝 Content Areas

1. **Company Research**: Target company profiles and intelligence
2. **Role Preparation**: Position-specific technical guidance
3. **Practice Modes**: Interactive interview simulation
4. **Industry Context**: Clinical trial and compliance frameworks
5. **Strategic Planning**: 30/60/90 day plans and positioning

## 🔄 Maintenance

- Update company research regularly
- Refresh interview questions based on market trends
- Maintain technical content currency
- Monitor user feedback and usage patterns

## 📄 License

Private repository - All rights reserved by F1Jobs.io

---

**Built with ❤️ by the F1Jobs.io team to help international talent succeed in their career journey.**