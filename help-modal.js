// help-modal.js - Keyboard Shortcuts Help Modal
class HelpModal {
    constructor() {
        this.modal = null;
        this.init();
    }

    init() {
        // Create help button (floating action button)
        this.createHelpButton();
        
        // Create modal
        this.createModal();
    }

    createHelpButton() {
        const button = document.createElement('button');
        button.id = 'help-button';
        button.className = 'help-button';
        button.innerHTML = '<i class="fas fa-question-circle"></i>';
        button.title = 'Keyboard Shortcuts (Press ?)';
        button.onclick = () => this.toggle();
        document.body.appendChild(button);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'help-modal';
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h2><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h2>
                    <button class="help-modal-close" onclick="window.helpModal.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-modal-body">
                    <div class="shortcut-group">
                        <h3>Navigation</h3>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>H</kbd>
                            </div>
                            <div class="shortcut-desc">Go to Home</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>T</kbd>
                            </div>
                            <div class="shortcut-desc">Open Themes</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Esc</kbd>
                            </div>
                            <div class="shortcut-desc">Close Modals/Popups</div>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h3>Games Page</h3>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>Ctrl</kbd> + <kbd>K</kbd>
                            </div>
                            <div class="shortcut-desc">Quick Search</div>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h3>Home Page</h3>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>1</kbd>
                            </div>
                            <div class="shortcut-desc">Games</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>2</kbd>
                            </div>
                            <div class="shortcut-desc">Apps</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>3</kbd>
                            </div>
                            <div class="shortcut-desc">Tools</div>
                        </div>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>4</kbd>
                            </div>
                            <div class="shortcut-desc">Roadmap</div>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h3>General</h3>
                        <div class="shortcut-item">
                            <div class="shortcut-keys">
                                <kbd>?</kbd>
                            </div>
                            <div class="shortcut-desc">Show this help</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.modal) {
            this.modal.classList.toggle('active');
        }
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }
}

// Initialize help modal
const helpModal = new HelpModal();
window.helpModal = helpModal;

// Add ? key listener
document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }
    
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        helpModal.toggle();
    }
});

