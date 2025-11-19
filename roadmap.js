// roadmap.js - Updated with goHome function
document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Roadmap page loaded');
    
    // Run animations and setup
    animateMilestones();
    setupScrollAnimations();
});

// Navigate back to home
function goHome() {
    window.location.href = 'index.html';
}

// Animate milestones on load
function animateMilestones() {
    try {
        const milestones = document.querySelectorAll('.milestone');
        
        if (!milestones || milestones.length === 0) {
            console.warn('No milestones found');
            return;
        }
        
        milestones.forEach((milestone, index) => {
            milestone.style.opacity = '0';
            milestone.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                milestone.style.transition = 'all 0.5s ease';
                milestone.style.opacity = '1';
                milestone.style.transform = 'translateX(0)';
            }, 100 * index);
        });
    } catch (e) {
        console.error('Error animating milestones:', e);
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    try {
        const phases = document.querySelectorAll('.timeline-phase');
        
        if (!phases || phases.length === 0) {
            console.warn('No timeline phases found');
            return;
        }
        
        // Check if IntersectionObserver is supported
        if (typeof IntersectionObserver === 'undefined') {
            console.warn('IntersectionObserver not supported, skipping scroll animations');
            phases.forEach(phase => {
                phase.style.opacity = '1';
                phase.style.transform = 'translateY(0)';
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        phases.forEach(phase => {
            phase.style.opacity = '0';
            phase.style.transform = 'translateY(30px)';
            phase.style.transition = 'all 0.6s ease';
            observer.observe(phase);
        });
    } catch (e) {
        console.error('Error setting up scroll animations:', e);
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goHome();
    }
});