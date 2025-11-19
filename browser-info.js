// browser-info.js - Display browser information
class BrowserInfo {
    constructor() {
        this.info = this.gatherInfo();
    }

    gatherInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: Date.now()
        };
    }

    getFormattedInfo() {
        const info = this.gatherInfo();
        return {
            'User Agent': info.userAgent,
            'Platform': info.platform,
            'Language': info.language,
            'Screen Resolution': `${info.screenWidth}x${info.screenHeight}`,
            'Viewport Size': `${info.viewportWidth}x${info.viewportHeight}`,
            'Color Depth': `${info.colorDepth} bits`,
            'Timezone': info.timezone,
            'Cookies Enabled': info.cookieEnabled ? 'Yes' : 'No',
            'Online Status': info.onLine ? 'Online' : 'Offline'
        };
    }

    displayInfo() {
        const info = this.getFormattedInfo();
        const infoText = Object.entries(info)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        
        return infoText;
    }
}

const browserInfo = new BrowserInfo();
window.browserInfo = browserInfo;

