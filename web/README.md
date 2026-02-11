# Hapetus Web Application

**Professional web interface for health monitoring**

## � Status: Ready for Deployment

This is the web application component of the Hapetus health monitoring platform. The website provides a professional, accessible interface for viewing and managing SpO2 and heart rate data across all devices.

### Quick Links
- 📖 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- 🔧 **[setup.sh](./setup.sh)** - Automated setup script
- � **API**: https://api.hapetus.info (Backend deployed and secured ✅)

---

## 🎯 Features

### Core Functionality
- ✅ Google Sign-In authentication (Firebase)
- ✅ Real-time data synchronization with backend API
- ✅ Interactive dashboard with statistics
- ✅ Advanced data visualization (Recharts)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Measurement history with filtering
- ✅ User settings management
- ⏳ Export data functionality (coming soon)

### Design Goals
- Professional, modern interface inspired by [Halo Lab](https://www.halo-lab.com/)
- WCAG 2.1 Level AA accessibility
- Fast loading (Lighthouse 90+)
- Smooth animations and transitions
- Consistent with mobile app design language

---

## 🏗️ Technology Stack

```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
UI Components: shadcn/ui + custom components
Charts: Recharts
State Management: React Context + hooks
Authentication: Firebase Auth SDK
Database: Cloud Firestore
Deployment: Firebase Hosting
```

---

## 🚀 Getting Started (Coming Soon)

### Prerequisites
```bash
Node.js 18+ 
npm or pnpm
Firebase CLI
```

### Installation
```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

---

## 📂 Project Structure (Planned)

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── dashboard/         # Dashboard components
│   │   └── forms/             # Form components
│   │
│   ├── lib/
│   │   ├── firebase/          # Firebase config & helpers
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Utility functions
│   │
│   └── types/                 # TypeScript definitions
│
├── public/                    # Static assets
├── firebase.json              # Firebase config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

The web application follows the Hapetus design system:
- **[View Design System →](../shared/design/DESIGN_SYSTEM.md)**

### Color Palette
```css
Primary: #2196F3 (Medical Blue)
Secondary: #4CAF50 (Healthcare Green)
Accent: #FF9800 (Warning Orange)
Error: #F44336 (Medical Red)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Responsive with clamp() functions
- **Weights**: 300, 400, 500, 600, 700

---

## 🔐 Authentication & Security

### Firebase Authentication
- Google Sign-In (OAuth 2.0)
- JWT token management
- Automatic token refresh
- Secure session handling

### Firestore Security
- User-based data isolation
- Read/write rules enforcement
- Input validation
- Rate limiting (Firebase App Check)

---

## 📊 Features Overview

### Landing Page
- Hero section with clear value proposition
- Feature showcase
- Screenshots/mockups
- Call-to-action (Sign in with Google)
- Footer with links and information

### Dashboard
- Overview statistics card
- Recent measurements list
- Quick add measurement button
- Navigation to all sections

### Measurements
- Add daily measurement form
- Add exercise measurement form
- Measurement history with filters
- Edit/delete functionality

### Reports
- Time range selector (7d, 30d, 3m, all)
- Statistics summary
- Interactive line charts
- Export data options

### Settings
- Alert threshold configuration
- Display preferences
- Account management
- Privacy settings

---

## 🧪 Testing (Planned)

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📈 Performance Goals

- **Lighthouse Score**: 90+ in all categories
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Core Web Vitals**: All green

---

## 🌐 Deployment

### Firebase Hosting
```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# View deployed site
firebase hosting:sites:list
```

### Custom Domain
Domain: `hapetus.info`
- DNS configuration
- SSL certificate (automatic via Firebase)

---

## 📖 Documentation

- [Main README](../README.md)
- [Architecture](../shared/docs/ARCHITECTURE.md)
- [Design System](../shared/design/DESIGN_SYSTEM.md)
- [Contributing](../CONTRIBUTING.md)

---

## 🚀 Development Roadmap

### Phase 2.1: Foundation (Weeks 1-2)
- [ ] Initialize Next.js project
- [ ] Configure Tailwind CSS
- [ ] Set up Firebase SDK
- [ ] Create component library
- [ ] Build landing page

### Phase 2.2: Authentication (Week 3)
- [ ] Implement Google Sign-In
- [ ] Protected routes
- [ ] Session management
- [ ] User profile

### Phase 2.3: Dashboard & Data (Weeks 4-5)
- [ ] Dashboard layout
- [ ] Measurement forms
- [ ] Data fetching and display
- [ ] Real-time listeners

### Phase 2.4: Reports & Charts (Week 6)
- [ ] Statistics calculations
- [ ] Chart components
- [ ] Time range filtering
- [ ] Export functionality

### Phase 2.5: Polish & Launch (Weeks 7-8)
- [ ] Responsive design
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Production deployment

---

## 🤝 Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Last Updated**: February 11, 2026  
**Status**: 🚧 In Development  
**Target Launch**: March 2026
