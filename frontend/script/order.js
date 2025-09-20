 
        // Get cart data from URL parameters or localStorage
        function getCartData() {
            const urlParams = new URLSearchParams(window.location.search);
            const product = urlParams.get('product');
            const price = urlParams.get('price');
            
            if (product && price) {
                return [{
                    name: product,
                    price: parseFloat(price),
                    quantity: 1,
                    icon: getProductIcon(product)
                }];
            }
            
            // Fallback to localStorage or default
            return [
                {
                    name: 'Arduino Uno R4 WiFi',
                    price: 45.99,
                    quantity: 1,
                    icon: 'fas fa-microchip'
                }
            ];
        }

        function getProductIcon(productName) {
            const iconMap = {
                'Arduino Uno R4 WiFi': 'fas fa-microchip',
                'DHT22 Sensor': 'fas fa-thermometer-half',
                'Raspberry Pi 5 8GB': 'fas fa-memory',
                'ESP32-S3 DevKit': 'fas fa-wifi',
                'PowerBoost 1000C': 'fas fa-battery-three-quarters',
                'OV2640 Camera Module': 'fas fa-camera'
            };
            
            for (const [key, icon] of Object.entries(iconMap)) {
                if (productName.includes(key.split(' ')[0])) {
                    return icon;
                }
            }
            
            return 'fas fa-microchip';
        }

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
        let cartData = getCartData();

        function updateQuantity(index, change) {
            cartData[index].quantity = Math.max(1, cartData[index].quantity + change);
            renderCart();
        }

        function removeItem(index) {
            cartData.splice(index, 1);
            if (cartData.length === 0) {
                // Redirect back to components if cart is empty
                window.location.href = 'components.html';
            }
            renderCart();
        }

        function renderCart() {
            const cartItemsContainer = document.getElementById('cartItems');
            const subtotalElement = document.getElementById('subtotal');
            const taxElement = document.getElementById('tax');
            const totalElement = document.getElementById('total');

            let cartHTML = '';
            let subtotal = 0;

            cartData.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                cartHTML += `
                    <div class="cart-item">
                        <div class="item-image">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-specs">Premium Quality Component</div>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                                       onchange="cartData[${index}].quantity = Math.max(1, parseInt(this.value) || 1); renderCart();">
                                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="qty-btn" onclick="removeItem(${index})" style="background: #e74c3c; margin-left: 10px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="item-price">${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            });

            cartItemsContainer.innerHTML = cartHTML;

            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            subtotalElement.textContent = `${subtotal.toFixed(2)}`;
            taxElement.textContent = `${tax.toFixed(2)}`;
            totalElement.textContent = `${total.toFixed(2)}`;
        }

        // Form validation
        function validateForm() {
            const form = document.getElementById('checkoutForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    field.style.borderColor = '#27ae60';
                }
            });

            // Phone number validation
            const phoneField = document.getElementById('phoneNumber');
            const phonePattern = /^[\+]?[0-9\s\(\)\-]{10,}$/;
            if (phoneField.value && !phonePattern.test(phoneField.value.replace(/\s/g, ''))) {
                phoneField.style.borderColor = '#e74c3c';
                isValid = false;
            }

            // Email validation (if provided)
            const emailField = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value && !emailPattern.test(emailField.value)) {
                emailField.style.borderColor = '#e74c3c';
                isValid = false;
            }

            return isValid;
        }

        // Place order functionality
        function placeOrder() {
            if (!validateForm()) {
                alert('Please fill in all required fields correctly.');
                return;
            }

            const placeOrderBtn = document.getElementById('placeOrderBtn');
            const originalText = placeOrderBtn.innerHTML;
            
            // Disable button and show loading
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';

            // Get form data
            const formData = new FormData(document.getElementById('checkoutForm'));
            const orderData = {
                customer: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    class: formData.get('class'),
                    division: formData.get('division'),
                    phoneNumber: formData.get('phoneNumber'),
                    email: formData.get('email'),
                    school: formData.get('school'),
                    notes: formData.get('notes')
                },
                items: cartData,
                total: document.getElementById('total').textContent,
                orderDate: new Date().toLocaleString()
            };

            // Simulate API call
            setTimeout(() => {
                // Generate order number
                const orderNumber = Math.floor(100000 + Math.random() * 900000);
                document.getElementById('orderNumber').textContent = orderNumber.toString().padStart(6, '0');
                document.getElementById('confirmPhone').textContent = formData.get('phoneNumber');

                // Update progress bar
                const steps = document.querySelectorAll('.step');
                steps[1].classList.remove('active');
                steps[1].classList.add('completed');
                steps[2].classList.add('active');
                
                // Update progress bar width
                const progressBar = document.querySelector('.progress-steps::after');
                document.querySelector('.progress-steps').style.setProperty('--progress-width', '100%');

                // Show success modal with countdown
                document.getElementById('successModal').classList.add('show');

                // Start countdown timer
                startCountdownTimer();

                // Store order data (in real app, this would go to server)
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.push({
                    ...orderData,
                    orderNumber: orderNumber,
                    status: 'Pending Confirmation'
                });
                localStorage.setItem('orders', JSON.stringify(orders));

                // Reset button
                placeOrderBtn.innerHTML = originalText;
                placeOrderBtn.disabled = false;

                // Clear cart
                localStorage.removeItem('cart');
                
                // Send WhatsApp message to admin (optional)
                const adminWhatsApp = '1234567890'; // Replace with actual admin number
                const orderSummary = cartData.map(item => 
                    `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
                ).join('\n');
                
                const whatsappMessage = encodeURIComponent(
                    `New Order Received!\n\n` +
                    `Order #: TS${orderNumber.toString().padStart(6, '0')}\n` +
                    `Customer: ${formData.get('firstName')} ${formData.get('lastName')}\n` +
                    `Class: ${formData.get('class')} - ${formData.get('division')}\n` +
                    `Phone: ${formData.get('phoneNumber')}\n` +
                    `School: ${formData.get('school') || 'Not specified'}\n\n` +
                    `Items:\n${orderSummary}\n\n` +
                    `Total: ${document.getElementById('total').textContent}\n\n` +
                    `Please call customer to confirm order.`
                );

                // Optional: Auto-send to admin (uncomment if needed)
                // setTimeout(() => {
                //     window.open(`https://wa.me/${adminWhatsApp}?text=${whatsappMessage}`, '_blank');
                // }, 2000);

            }, 3000); // 3 second delay to simulate processing
        }

        // Real-time form validation
        document.addEventListener('DOMContentLoaded', () => {
            const inputs = document.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.style.borderColor = '#e74c3c';
                    } else if (input.value.trim()) {
                        // Additional validation for specific fields
                        if (input.type === 'email' && input.value) {
                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            input.style.borderColor = emailPattern.test(input.value) ? '#27ae60' : '#e74c3c';
                        } else if (input.type === 'tel') {
                            const phonePattern = /^[\+]?[0-9\s\(\)\-]{10,}$/;
                            input.style.borderColor = phonePattern.test(input.value.replace(/\s/g, '')) ? '#27ae60' : '#e74c3c';
                        } else {
                            input.style.borderColor = '#27ae60';
                        }
                    } else {
                        input.style.borderColor = '#e1e8ed';
                    }
                });

                // Reset border color on focus
                input.addEventListener('focus', () => {
                    input.style.borderColor = '#3498db';
                });
            });

            // Phone number formatting
            const phoneInput = document.getElementById('phoneNumber');
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }
                }
                e.target.value = value;
            });

            // Initialize cart display
            renderCart();

            // Add event listener to place order button
            document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);

            // Close modal when clicking outside
            document.getElementById('successModal').addEventListener('click', (e) => {
                if (e.target === document.getElementById('successModal')) {
                    document.getElementById('successModal').classList.remove('show');
                }
            });
        });

        // Smooth scroll for form validation errors
        function scrollToFirstError() {
            const firstError = document.querySelector('input[style*="border-color: rgb(231, 76, 60)"], select[style*="border-color: rgb(231, 76, 60)"]');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                firstError.focus();
            }
        }

        // Add some interactive animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes formFieldFocus {
                from { transform: translateY(2px); }
                to { transform: translateY(0); }
            }
            
            .form-group input:focus,
            .form-group select:focus {
                animation: formFieldFocus 0.2s ease;
            }
            
            .progress-steps::after {
                width: var(--progress-width, 66%);
            }
            
            .cart-item {
                transition: all 0.3s ease;
            }
            
            .cart-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);

        // Loading animation on page load
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.style.transition = 'all 0.8s ease';
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
            }, 100);
        });

        // Prevent form submission on Enter key (except for the place order button)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
                e.preventDefault();
            }
        });

        // Auto-save form data to localStorage
        function autoSaveForm() {
            const formData = new FormData(document.getElementById('checkoutForm'));
            const formObject = {};
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            localStorage.setItem('checkoutFormData', JSON.stringify(formObject));
        }

        // Load saved form data
        function loadSavedFormData() {
            const savedData = localStorage.getItem('checkoutFormData');
            if (savedData) {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && formData[key]) {
                        field.value = formData[key];
                    }
                });
            }
        }

        // Initialize auto-save
        document.addEventListener('DOMContentLoaded', () => {
            loadSavedFormData();
            
            // Auto-save on input changes
            const form = document.getElementById('checkoutForm');
            form.addEventListener('input', autoSaveForm);
            form.addEventListener('change', autoSaveForm);
        });