// --- Global DOM Elements ---
const popupContainer = document.getElementById('popup-container');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const signUpLink = document.getElementById('signup-link');
const navItems = document.querySelectorAll('.nav-item'); // Kept for selector, but no longer used for navigation
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

const POPUP_AUTO_DISMISS_TIME = 5000;
const MIN_PASSWORD_LENGTH = 6;


// --- Popup Management System ---

/**
 * Shows a new popup notification.
 * @param {string} type - 'success', 'error', 'info', or 'warning'.
 * @param {string} message - The message to display.
 */
function showPopup(type, message) {
    const popup = document.createElement('div');
    popup.classList.add('popup', type);
    
    // Determine the icon based on the type
    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-circle'
    }[type];

    popup.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="popup-message">${message}</div>
        <button class="popup-close" onclick="window.dismissPopup(this.closest('.popup'))">&times;</button>
    `;

    popupContainer.appendChild(popup);

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => dismissPopup(popup), POPUP_AUTO_DISMISS_TIME);

    // Store the timer reference on the popup element
    popup.dismissTimer = timer;
}

/**
 * Dismisses a specific popup with a slide-out animation.
 * Exposed globally so it can be called from the inline onclick.
 * @param {HTMLElement} popupElement - The popup element to dismiss.
 */
window.dismissPopup = function(popupElement) {
    clearTimeout(popupElement.dismissTimer);
    popupElement.classList.add('slide-out');
    
    // Remove the element from the DOM after the animation completes
    popupElement.addEventListener('animationend', () => {
        if (popupElement.parentNode) {
            popupElement.parentNode.removeChild(popupElement);
        }
    }, { once: true });
}


// --- Form Validation and Submission Logic ---

/**
 * Basic email format/username validation.
 */
function isValidEmail(email) {
    // Basic regex for email, or allow just a username (no '@')
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) || !email.includes('@');
}

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 1. Check for empty fields
        if (!email || !password) {
            showPopup('warning', 'Please fill in all required fields.');
            return;
        }

        // 2. Validate email format
        if (!isValidEmail(email)) {
            showPopup('error', 'Invalid email or username format.');
            return;
        }

        // 3. Validate password minimum length
        if (password.length < MIN_PASSWORD_LENGTH) {
            showPopup('error', `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
            return;
        }
        
        // 4. Simulate server-side validation (Replace this with actual API call)
        if (email.toLowerCase() !== 'user@nutrigo.com' || password !== 'correctpassword') {
            showPopup('error', 'Invalid email or password.');
            return;
        }

        // 5. Success State
        showPopup('success', 'Login successful! Redirecting...');
    });
}


// --- Password Visibility Toggle ---
if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function() {
        const isPasswordVisible = passwordInput.getAttribute('type') === 'password';
        const newType = isPasswordVisible ? 'text' : 'password';
        
        passwordInput.setAttribute('type', newType);
        
        // Toggle the eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
        
        // Info Popup Feedback
        const message = isPasswordVisible ? 'Password visibility toggled ON' : 'Password visibility toggled OFF';
        showPopup('info', message);
    });
}

// --- Helper Link Handlers ---
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        showPopup('info', 'Password reset link sent to your email (simulated)');
    });
}

if (signUpLink) {
    signUpLink.addEventListener('click', function(event) {
        // This allows the link's href="sign-up.html" to execute.
        
        // Show a popup before navigation starts
        showPopup('info', 'Redirecting to registration page...');
        
        // Note: The browser will handle the navigation to sign-up.html 
        // shortly after this function completes.
    });
}

// --- Navigation Handlers (CLEANED UP - Sidebar navigation handled by HTML <a> tags) ---

// Mobile Menu Toggle Handler
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        navMenu.classList.toggle('active');
        sidebar.classList.toggle('active'); // Add/remove active class to sidebar for full collapse/expand
        // Optional: Toggle the hamburger/close icon
        menuToggle.classList.toggle('fa-bars');
        menuToggle.classList.toggle('fa-times');
    });
}