/**
 * UI Module
 * Handles general UI interactions: Animations, Mobile Menu, Scroll effects
 */
export class UI {
    constructor() {
        this.initSplashScreen();
        this.initScrollAnimations();
        this.initMobileMenu();
        this.initHeaderScroll();
    }

    /**
     * Handles the initial splash screen animation
     */
    initSplashScreen() {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            setTimeout(() => {
                splash.classList.add('fade-out');
                document.body.classList.remove('loading');
                setTimeout(() => {
                    splash.style.display = 'none';
                }, 1000);
            }, 2000);
        }
    }

    /**
     * Sets up IntersectionObserver for scroll animations
     */
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.fade-in-up, .class-card, .gallery-item, .pricing-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Handles mobile menu toggle and closing
     */
    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                const icon = menuToggle.querySelector('i');
                const isOpen = mainNav.classList.toggle('active');

                if (isOpen) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });

            // Close menu when clicking a link
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                });
            });
        }
    }

    /**
     * Adds background to header on scroll
     */
    initHeaderScroll() {
        const header = document.querySelector('.main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
