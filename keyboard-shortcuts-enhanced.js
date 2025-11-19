// keyboard-shortcuts-enhanced.js - Enhanced keyboard shortcuts including tab cloaking
class EnhancedKeyboardShortcuts {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // Tab cloaking shortcuts
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (window.toolsManager) {
                    window.toolsManager.openTabCloaker();
                } else if (typeof openTabCloaker === 'function') {
                    openTabCloaker();
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                if (window.tabCloaking) {
                    window.tabCloaking.removeCloaking();
                    if (window.Utils) {
                        window.Utils.showSuccess('Tab cloaking removed!');
                    }
                }
            }

            // Settings export/import
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                if (window.Utils) {
                    window.Utils.exportSettings();
                }
            }
        });
    }
}

// Initialize enhanced keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedKeyboardShortcuts();
});

