// --- Global DOM Elements ---
const popupContainer = document.getElementById('popup-container');
const registrationForm = document.getElementById('registration-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const termsCheckbox = document.getElementById('terms');
const passwordToggles = document.querySelectorAll('.password-toggle');
const passwordStrengthMeter = document.getElementById('password-strength');

// Modal elements
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const termsLink = document.getElementById('terms-link');
const privacyLink = document.getElementById('privacy-link');

// Navigation elements (for mobile menu)
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// --- Constants ---
const POPUP_AUTO_DISMISS_TIME = 5000;
const MIN_PASSWORD_LENGTH = 8;


// ===================================
// I. POPUP MANAGEMENT SYSTEM
// ===================================

/**
 * Shows a new popup notification.
 */
function showPopup(type, message, duration = POPUP_AUTO_DISMISS_TIME) {
    // Check if container exists, otherwise skip (for pages without popup container)
    if (!popupContainer) return;

    const popup = document.createElement('div');
    popup.classList.add('popup', type);
    
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

    const timer = setTimeout(() => dismissPopup(popup), duration);

    popup.dismissTimer = timer;
}

/**
 * Dismisses a specific popup with a slide-out animation.
 */
window.dismissPopup = function(popupElement) {
    clearTimeout(popupElement.dismissTimer);
    popupElement.classList.add('slide-out');
    
    popupElement.addEventListener('animationend', () => {
        if (popupElement.parentNode) {
            popupElement.parentNode.removeChild(popupElement);
        }
    }, { once: true });
}


// ===================================
// II. FORM VALIDATION & LOGIC
// ===================================

/**
 * Basic email format validation.
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Checks password strength.
 */
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= MIN_PASSWORD_LENGTH) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 4) return 'strong';
    if (score >= 2) return 'medium';
    if (password.length > 0) return 'weak';
    return '';
}

/**
 * Updates the visual password strength meter and shows popups.
 */
function updatePasswordStrength() {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);

    // Update meter class (Assuming CSS handles the meter styling based on class)
    if (passwordStrengthMeter) {
        passwordStrengthMeter.className = `strength-meter ${strength}`;
    }

    // Show dynamic password strength popup (only if password exists)
    if (password.length > 0) {
        let message = '';
        let type = 'info';
        if (strength === 'weak') {
            message = 'Password is weak. Try mixing letters, numbers, and symbols.';
            type = 'warning';
        } else if (strength === 'medium') {
            message = 'Password strength is medium.';
            type = 'info';
        } else if (strength === 'strong') {
            message = 'Password is strong!';
            type = 'success';
        }
        showPopup(type, message, 3000); 
    }
}

/**
 * Checks if passwords match and shows feedback.
 */
function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length === 0) return;

    if (password !== confirmPassword) {
        showPopup('error', 'Passwords do not match.');
    } else {
        showPopup('success', 'Passwords match!');
    }
}

// Simulates an email availability check
let emailCheckTimeout;
if (emailInput) {
    emailInput.addEventListener('input', function() {
        clearTimeout(emailCheckTimeout);
        if (passwordStrengthMeter) {
            passwordStrengthMeter.className = 'strength-meter'; // Clear strength meter on input
        }

        const email = this.value;
        if (!isValidEmail(email)) {
            showPopup('error', 'Invalid email format.', 2000);
            return;
        }

        // Simulate async check
        emailCheckTimeout = setTimeout(() => {
            showPopup('info', 'Checking email availability...');
            setTimeout(() => {
                if (email === 'taken@nutrigo.com') { 
                    showPopup('error', 'Email already registered. Try signing in.');
                } else {
                    showPopup('success', 'Email is available.');
                }
            }, 1000);
        }, 500);
    });
}

// Real-time password strength/matching on input
if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordStrength);
}
if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
}

// Password Visibility Toggles
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        
        if (!targetInput) return; // Safety check
        
        const isPasswordVisible = targetInput.getAttribute('type') === 'password';
        const newType = isPasswordVisible ? 'text' : 'password';
        
        targetInput.setAttribute('type', newType);
        
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
        
        const message = isPasswordVisible ? `${targetId} visibility ON` : `${targetId} visibility OFF`;
        showPopup('info', message, 2000);
    });
});


// --- Form Submission Handler ---
if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        // 1. Comprehensive Required Field Check
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showPopup('warning', 'Please fill in all required fields (First Name, Last Name, Email, Password).');
            return;
        }

        // 2. Terms Agreement Check
        if (!termsCheckbox.checked) {
            showPopup('warning', 'Please accept the Terms of Service and Privacy Policy to continue.');
            return;
        }

        // 3. Email Format Check
        if (!isValidEmail(email)) {
            showPopup('error', 'Please enter a valid email address.');
            return;
        }

        // 4. Password Strength/Mismatch Check
        if (checkPasswordStrength(password) === 'weak') {
            showPopup('error', 'Please choose a stronger password.');
            return;
        }
        if (password !== confirmPassword) {
            showPopup('error', 'Passwords do not match. Please re-enter.');
            return;
        }
        
        // --- Submission Flow Simulation ---
        showPopup('info', 'Creating your account...', 5000); 

        setTimeout(() => {
            showPopup('success', 'Account created successfully! Welcome to Nutrigo!', 4000);
            
            // Simulate redirect to login page (after a delay)
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        }, 2000); // 2-second simulation delay
    });
}


// ===================================
// III. ADDITIONAL FEATURES HANDLERS
// ===================================

// --- Modal Handlers for T&C and Privacy Links ---
function openModal(title, body) {
    if (!modal || !modalTitle || !modalBody) return; // Safety check
    
    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    modal.style.display = 'block';
}

if (termsLink) {
    termsLink.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('Nutrigo Terms of Service', 
            'These are the simulated terms. By signing up, you agree to our policies regarding health tracking and data usage. The terms cover user conduct, liability limitations, and service usage guidelines.'
        );
    });
}

if (privacyLink) {
    privacyLink.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('Nutrigo Privacy Policy', 
            'We value your privacy. Your simulated fitness data will only be used to provide personalized health recommendations. This policy outlines how user data (simulated) would be collected, used, and protected, including data encryption, third-party sharing policies, and data retention.'
        );
    });
}

if (modalClose) {
    modalClose.addEventListener('click', function() {
        if (modal) modal.style.display = 'none';
    });
}

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


// --- Mobile Menu Handler ---
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        navMenu.classList.toggle('active');
        // We rely on the CSS media query to handle the positioning of nav-menu 
        // using the 'active' class on nav-menu directly.
        menuToggle.classList.toggle('fa-bars');
        menuToggle.classList.toggle('fa-times');
    });
}