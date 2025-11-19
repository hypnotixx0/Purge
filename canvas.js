// canvas.js - Improved Visible Floating Particle Animation
class FloatingCanvas {
    constructor() {
        this.canvas = document.getElementById('floating-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.resizeListener = () => this.resizeCanvas();
        this.mouseMoveListener = (e) => {
            // Store window coordinates - will be converted to canvas-relative in updateParticles
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        };
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('mousemove', this.mouseMoveListener);
        console.log('🎨 Floating canvas initialized');
    }

    resizeCanvas() {
        this.canvas.width = 120;
        this.canvas.height = 120;
    }

    createParticles() {
        this.particles = [];
        const particleCount = 12; // Increased for better visibility
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 2, // Larger particles
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.7 + 0.3 // More opaque
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#8B5CF6', '#A78BFA', '#7C3AED', '#6D28D9',
            '#3B82F6', '#60A5FA', '#2563EB', '#1D4ED8',
            '#10B981', '#34D399', '#059669', '#047857',
            '#F59E0B', '#FBBF24', '#D97706', '#B45309',
            '#EC4899', '#F472B6', '#DB2777', '#BE185D'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Clear with dark background for better contrast
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawParticles();
        this.drawConnections();
    }

    updateParticles() {
        // Get canvas container position for accurate mouse coordinates
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = this.mouse.x - canvasRect.left;
        const mouseY = this.mouse.y - canvasRect.top;
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce with padding
            if (particle.x < 5 || particle.x > this.canvas.width - 5) {
                particle.speedX *= -1;
            }
            if (particle.y < 5 || particle.y > this.canvas.height - 5) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction - use canvas-relative coordinates
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                const angle = Math.atan2(dy, dx);
                const force = (80 - distance) / 80;
                particle.x += Math.cos(angle) * force * 3;
                particle.y += Math.sin(angle) * force * 3;
            }
            
            // Add some randomness
            if (Math.random() > 0.95) {
                particle.speedX += (Math.random() - 0.5) * 0.2;
                particle.speedY += (Math.random() - 0.5) * 0.2;
            }
            
            // Speed limits
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > 3) {
                particle.speedX = (particle.speedX / speed) * 3;
                particle.speedY = (particle.speedY / speed) * 3;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        });
        this.ctx.globalAlpha = 1;
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 60) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.particles[i].color;
                    this.ctx.globalAlpha = 0.3 * (1 - distance / 60);
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    updateColors() {
        this.particles.forEach(particle => {
            particle.color = this.getRandomColor();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('mousemove', this.mouseMoveListener);
        this.particles = [];
    }
}

let floatingCanvas;
document.addEventListener('DOMContentLoaded', function() {
    floatingCanvas = new FloatingCanvas();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (floatingCanvas) floatingCanvas.destroy();
});

function goToThemes() {
    // Themes should be accessible without a key
    window.location.href = 'themes.html';
}