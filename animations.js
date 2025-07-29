// Advanced animation controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.rafId = null;
        this.isRAFRunning = false;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupClickAnimations();
    }
    
    // Setup intersection observers for various animation types
    setupIntersectionObservers() {
        // Fade in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerFadeAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Slide animations
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSlideAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Scale animations
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScaleAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        this.observers.set('fade', fadeObserver);
        this.observers.set('slide', slideObserver);
        this.observers.set('scale', scaleObserver);
        
        this.observeElements();
    }
    
    observeElements() {
        // Observe fade elements
        document.querySelectorAll('.animate-fade-up, .animate-fade-in, .fade-animation').forEach(el => {
            this.observers.get('fade').observe(el);
        });
        
        // Observe slide elements
        document.querySelectorAll('.animate-slide-up, .animate-slide-left, .animate-slide-right, .slide-animation').forEach(el => {
            this.observers.get('slide').observe(el);
        });
        
        // Observe scale elements
        document.querySelectorAll('.animate-scale-up, .scale-animation').forEach(el => {
            this.observers.get('scale').observe(el);
        });
    }
    
    triggerFadeAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        this.observers.get('fade').unobserve(element);
    }
    
    triggerSlideAnimation(element) {
        const direction = element.classList.contains('animate-slide-left') ? 'left' : 
                         element.classList.contains('animate-slide-right') ? 'right' : 'up';
        
        let initialTransform;
        switch(direction) {
            case 'left':
                initialTransform = 'translateX(-50px)';
                break;
            case 'right':
                initialTransform = 'translateX(50px)';
                break;
            default:
                initialTransform = 'translateY(30px)';
        }
        
        element.style.opacity = '0';
        element.style.transform = initialTransform;
        element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0) translateY(0)';
        });
        
        this.observers.get('slide').unobserve(element);
    }
    
    triggerScaleAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
        
        this.observers.get('scale').unobserve(element);
    }
    
    setupScrollAnimations() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallaxElements();
                    this.updateProgressBars();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    updateParallaxElements() {
        const scrollTop = window.pageYOffset;
        
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateProgressBars() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        document.querySelectorAll('.progress-bar-scroll').forEach(bar => {
            bar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }
    
    setupHoverAnimations() {
        // Enhanced hover effects for service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateServiceCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateServiceCard(card, 'leave');
            });
        });
        
        // Pricing card hover effects
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animatePricingCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animatePricingCard(card, 'leave');
            });
        });
        
        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.animateButton(btn, 'enter');
            });
            
            btn.addEventListener('mouseleave', () => {
                this.animateButton(btn, 'leave');
            });
        });
    }
    
    animateServiceCard(card, action) {
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('.service-title');
        const features = card.querySelectorAll('.service-features li');
        
        if (action === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            if (icon) {
                icon.style.transform = 'scale(1.05)';
            }
            
            if (title) {
                title.style.color = 'var(--primary-color)';
            }
            
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.style.transform = 'translateX(10px)';
                    feature.style.color = 'var(--dark-color)';
                }, index * 50);
            });
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
            
            if (icon) {
                icon.style.transform = '';
            }
            
            if (title) {
                title.style.color = '';
            }
            
            features.forEach(feature => {
                feature.style.transform = '';
                feature.style.color = '';
            });
        }
    }
    
    animatePricingCard(card, action) {
        const price = card.querySelector('.plan-price');
        const features = card.querySelectorAll('.plan-features li');
        const button = card.querySelector('.btn');
        
        if (action === 'enter') {
            card.style.transform = 'translateY(-5px) scale(1.03)';
            
            if (price) {
                price.style.transform = 'scale(1.1)';
                price.style.color = 'var(--primary-color)';
            }
            
            if (button) {
                button.style.transform = 'scale(1.05)';
            }
            
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.style.transform = 'translateX(5px)';
                }, index * 30);
            });
        } else {
            card.style.transform = '';
            
            if (price) {
                price.style.transform = '';
                price.style.color = '';
            }
            
            if (button) {
                button.style.transform = '';
            }
            
            features.forEach(feature => {
                feature.style.transform = '';
            });
        }
    }
    
    animateButton(btn, action) {
        if (action === 'enter') {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            
            // Create ripple effect
            this.createRipple(btn);
        } else {
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }
    }
    
    createRipple(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupClickAnimations() {
        // Click animations for interactive elements
        document.querySelectorAll('.btn, .nav-link, .testimonial-dot').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createClickAnimation(e.target, e);
            });
        });
    }
    
    createClickAnimation(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const clickEffect = document.createElement('span');
        clickEffect.className = 'click-effect';
        clickEffect.style.position = 'absolute';
        clickEffect.style.left = x + 'px';
        clickEffect.style.top = y + 'px';
        clickEffect.style.width = '0px';
        clickEffect.style.height = '0px';
        clickEffect.style.borderRadius = '50%';
        clickEffect.style.background = 'rgba(255, 107, 53, 0.3)';
        clickEffect.style.transform = 'translate(-50%, -50%)';
        clickEffect.style.pointerEvents = 'none';
        clickEffect.style.animation = 'clickRipple 0.6s ease-out';
        
        element.style.position = 'relative';
        element.appendChild(clickEffect);
        
        setTimeout(() => {
            clickEffect.remove();
        }, 600);
    }
    
    // Utility methods
    animateCountUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const animate = () => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
            } else {
                element.textContent = Math.floor(current);
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    morphShape(element, newPath, duration = 1000) {
        if (element.tagName !== 'path') return;
        
        const currentPath = element.getAttribute('d');
        element.style.transition = `d ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.setAttribute('d', newPath);
        });
    }
    
    // Performance monitoring
    startPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitor = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    console.warn('Low FPS detected:', fps);
                    this.optimizeAnimations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
    
    optimizeAnimations() {
        // Reduce animation complexity for better performance
        document.querySelectorAll('[data-parallax]').forEach(el => {
            el.style.transform = 'none';
        });
        
        // Disable non-essential animations
        document.body.classList.add('reduce-animations');
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// CSS for additional animations
const additionalStyles = `
    @keyframes clickRipple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    .reduce-animations * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
    }
    
    .click-effect {
        z-index: 1000;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Start performance monitoring in development
    if (window.location.hostname === 'localhost') {
        window.animationController.startPerformanceMonitoring();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}