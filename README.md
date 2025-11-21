# /Purge - Unblocked Games & Tools

A modern web application for unblocked games and utility tools with advanced theming, tab cloaking, and more.

## Features

- **Premium Key System**: Secure authentication with tiered access levels
- **Premium Chat**: Real-time chat with moderation, themes, and anonymous usernames
- **Theme System**: Multiple themes (Dark, Cyberpunk, Ocean, Forest, Sunset)
- **Achievement System**: Gamification with progress tracking
- **Tab Management**: Smart tab system with cloaking features
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Rate Limiting**: Anti-spam protection in chat
- **Moderator Mode**: Admin controls for chat management
- 📱 **Mobile Friendly** - Works on all devices

## File Structure

```
Purge/
├── index.html              # Homepage with premium chat access
├── games.html              # Games library
├── apps.html               # Apps section
├── tools.html              # Tools page
├── themes.html             # Theme selector
├── roadmap.html            # Roadmap
├── settings.html           # Settings page
├── blocked.html            # Access blocked page
├── styles.css              # Main styles with CSS variables
├── premium-chat.css        # Premium chat component styles
├── games.css               # Games page styles
├── apps.css                # Apps page styles
├── themes.css              # Themes page styles
├── tools.css               # Tools page styles
├── roadmap.css             # Roadmap styles
├── settings.css            # Settings page styles
├── achievements.css        # Achievement system styles
├── achievements-display.css
├── fullscreen-indicator.css
├── page-transitions.css
├── quick-stats.css
├── tab-manager.css         # Tab system styles
├── themes-widget.css       # Themes widget styles
├── tooltip.css             # Tooltip styles
├── key-system.js           # Premium key authentication
├── premium-chat.js         # Premium chat functionality
├── theme-manager.js        # Theme management
├── achievements.js         # Achievement system
├── settings.js            # Settings management
├── tab-manager.js          # Tab management
├── firebase-rules.json     # Firebase security rules
├── vercel.json             # Vercel configuration
├── games/                  # Game files
│   ├── game-browser.css    # Game browser styles
│   ├── balatro.html
│   ├── cookieclicker.html
│   ├── kindergarden1.html
│   ├── kindergarden2.html
│   └── ...
├── js/                     # JavaScript files (organized)
│   ├── core/
│   ├── features/
│   └── utils/
├── assets/                 # Static assets
│   └── icons/
└── vercel.json             # Vercel configuration
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

The `vercel.json` file is already configured for static hosting.

### Live Server (Local Development)

1. Install Live Server extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

Or use any static file server:
```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

## Usage

### Themes
- Click the themes bar at the top to open theme selector
- Click any theme preview to apply it instantly
- Use arrows to navigate themes
- Create custom themes with background images

### Tab System
- Click any game to open it in a new tab
- Use the "+" button to open new tabs
- Switch between tabs by clicking them
- Close tabs with the X button

### Tab Cloaking
- Go to Tools page
- Click "Tab Cloaking"
- Select a preset or create custom
- Cloaking applies to all pages automatically

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

© 2025 /Purge. All rights reserved.

