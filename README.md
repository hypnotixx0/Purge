# /Purge - Unblocked Games & Tools

A modern web application for unblocked games and utility tools with advanced theming, tab cloaking, and more.

## Features

- 🎮 **Games Library** - Play hundreds of unblocked games
- 🎨 **27+ Themes** - Beautiful themes with custom theme support
- 🎭 **Tab Cloaking** - Disguise your browser tab
- 🔒 **Blob Cloaking** - Open sites in cloaked windows
- 📑 **Tab System** - Open multiple games in tabs
- ⚡ **Fast & Responsive** - Optimized for performance
- 📱 **Mobile Friendly** - Works on all devices

## File Structure

```
Purge/
├── index.html              # Homepage
├── games.html              # Games library
├── themes.html             # Theme selector
├── tools.html              # Tools page
├── roadmap.html            # Roadmap
├── blocked.html            # Access blocked page
├── styles.css              # Main styles
├── games.css               # Games page styles
├── themes.css              # Themes page styles
├── tools.css               # Tools page styles
├── roadmap.css             # Roadmap styles
├── tooltip.css             # Tooltip styles
├── tab-manager.css         # Tab system styles
├── themes-widget.css       # Themes widget styles
├── games/                  # Game files
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

