document.addEventListener('DOMContentLoaded', function() {
    // Particle system
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.5';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = Math.random() * 100 + 100;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.color = `rgba(255, ${Math.random() * 105 + 105}, ${Math.random() * 147 + 108}, ${this.opacity})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 100 }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const fadeElems = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // Floating orb animation
    const floatingOrb = document.querySelector('.floating-orb');
    let orbAngle = 0;

    function animateOrb() {
        orbAngle += 0.02;
        const x = Math.sin(orbAngle) * 20;
        const y = Math.cos(orbAngle) * 20;
        floatingOrb.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animateOrb);
    }

    animateOrb();

    // Ripple effect animation
    const rippleEffect = document.querySelector('.ripple-effect');
    let rippleScale = 1;

    function animateRipple() {
        rippleScale += 0.01;
        if (rippleScale > 1.5) rippleScale = 1;
        rippleEffect.style.transform = `translate(-50%, -50%) scale(${rippleScale})`;
        requestAnimationFrame(animateRipple);
    }

    animateRipple();

    // Glitch text effect
    const glitchText = document.querySelector('.glitch-text');
    let glitchInterval;

    function startGlitch() {
        if (glitchInterval) clearInterval(glitchInterval);
        glitchInterval = setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 10}px ${Math.random() * 10}px ${Math.random() * 10}px rgba(255,105,180,0.7),
                ${Math.random() * -10}px ${Math.random() * 10}px ${Math.random() * 10}px rgba(255,20,147,0.7)
            `;
        }, 50);
        setTimeout(() => {
            clearInterval(glitchInterval);
            glitchText.style.textShadow = '2px 2px var(--primary), -2px -2px var(--accent)';
        }, 500);
    }

    glitchText.addEventListener('mouseover', startGlitch);

    // Interactive feature cards
    const featureCards = document.querySelectorAll('.feature, .use-case, .subsection');
    featureCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 15px 30px rgba(255, 105, 180, 0.3)';
        });
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 20px rgba(255, 105, 180, 0.2)';
        });
    });
});
