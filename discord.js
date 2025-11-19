// Simple and reliable functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        const popup = document.getElementById('popup');
        const discordBtn = document.getElementById('discord-btn');
        const closeBtn = document.getElementById('close-popup');
        
        if (!popup || !discordBtn || !closeBtn) {
            console.warn('⚠️ Discord popup elements not found');
            return;
        }

        const openPopup = () => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closePopup = () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        };

        discordBtn.addEventListener('click', openPopup);
        closeBtn.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                closePopup();
            }
        });

        console.log('✅ Discord system loaded');
    } catch (e) {
        console.error('❌ Discord system error:', e);
    }
});