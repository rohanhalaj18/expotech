// Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        let isDark = false;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            const icon = themeToggle.querySelector('i');
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
            
            // Store preference
            const theme = isDark ? 'dark' : 'light';
            document.cookie = `theme=${theme}; path=/; max-age=31536000`;
        });

        // Load saved theme
        window.addEventListener('load', () => {
            const cookies = document.cookie.split(';');
            const themeCookie = cookies.find(cookie => cookie.trim().startsWith('theme='));
            
            if (themeCookie) {
                const theme = themeCookie.split('=')[1];
                if (theme === 'dark') {
                    isDark = true;
                    body.setAttribute('data-theme', 'dark');
                    themeToggle.querySelector('i').className = 'fas fa-moon';
                }
            }
        });

        // Cart functionality
        let cartCount = 0;
        const cartIcon = document.querySelector('.cart-badge');

        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                successMessage.classList.add('show');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        });

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.style.transition = 'all 0.8s ease';
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
            }, 100);
        });

        // Add bounce animation for cart
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
            .cart-badge::after {
                content: var(--cart-count, '0');
            }
        `;
        document.head.appendChild(style);