// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nutrigo Dashboard Initialized');
    initCalendar();
    initNavigation();
    initInteractions();
    animateProgressBars();
    animateCards();
    updateDateTime();
    initSearch();
    simulateDataUpdates();
});

// Calendar functionality
function initCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        if (day.textContent) {
            day.addEventListener('click', function() {
                // Remove active class from all days
                calendarDays.forEach(d => d.classList.remove('active'));
                // Add active class to clicked day
                this.classList.add('active');
                
                // Update meal list with animation
                updateMealList(this.textContent);
                
                // Show notification
                showNotification(`Showing meals for day ${this.textContent}`, 'info');
            });
        }
    });

    // Calendar navigation
    const navButtons = document.querySelectorAll('.calendar-nav button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '‹') {
                navigateMonth(-1);
            } else {
                navigateMonth(1);
            }
        });
    });
}

// Navigate between months
function navigateMonth(direction) {
    const monthHeader = document.querySelector('.calendar-header h3');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentText = monthHeader.textContent.split(' ');
    const currentMonth = months.indexOf(currentText[0]);
    let currentYear = parseInt(currentText[1]);
    
    let newMonth = currentMonth + direction;
    
    if (newMonth < 0) {
        newMonth = 11;
        currentYear--;
    } else if (newMonth > 11) {
        newMonth = 0;
        currentYear++;
    }
    
    // Animate the transition
    monthHeader.style.opacity = '0';
    setTimeout(() => {
        monthHeader.textContent = `${months[newMonth]} ${currentYear}`;
        monthHeader.style.opacity = '1';
    }, 150);
    
    showNotification(`Mapsd to ${months[newMonth]} ${currentYear}`, 'success');
}

// Update meal list based on selected day
function updateMealList(day) {
    const mealList = document.querySelector('.meal-list');
    
    // Add a subtle animation
    mealList.style.opacity = '0.5';
    
    setTimeout(() => {
        mealList.style.opacity = '1';
        console.log(`Meals loaded for day ${day}`);
    }, 300);
}

// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('active')) {
                e.preventDefault();
                
                // Remove active from all
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                
                // Get the page name
                const pageName = this.querySelector('span:not(.icon):not(.badge)').textContent;
                
                // Show notification
                showNotification(`Navigating to ${pageName}...`, 'info');
                
                // Simulate page transition
                const mainContent = document.querySelector('.main-content');
                mainContent.style.opacity = '0.5';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                }, 300);
            }
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        // Replaced browser alert with custom notification/console log
        console.log('Logout attempt: Are you sure you want to logout?');
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            showNotification('You have been logged out!', 'success');
            console.log('Logged out.');
        }, 1000);
    });
}

// Initialize interactive elements
function initInteractions() {
    // === START: Custom logic for clickable cards (Redirect to Profile) ===
    const profileRedirectCards = document.querySelectorAll('.card-link');
    profileRedirectCards.forEach(cardLink => {
        // We target the anchor tag wrapper (.card-link) which contains the stat data
        cardLink.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetUrl = this.getAttribute('href'); 
            
            // Get the name of the section being clicked for a specific message
            const cardElement = this.closest('.stat-card') || this.closest('.card');
            let cardName = 'details';
            try {
                // Try to get the name from stat-header span or h3 header
                const spanHeader = cardElement.querySelector('.stat-header span');
                const h3Header = cardElement.querySelector('.card-header h3');

                if (spanHeader) {
                    cardName = spanHeader.textContent.trim();
                } else if (h3Header) {
                    cardName = h3Header.textContent.trim();
                }
            } catch (error) {
                cardName = 'details';
            }
            
            // Show the pop-up message using the existing showNotification function
            showNotification(`Filing the ${cardName} and navigating to Profile...`, 'warning');

            // Delay navigation to allow the message to display
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1500); 
        });
    });
    // === END: Custom logic for clickable cards ===


    // Icon buttons with tooltips
    const iconBtns = document.querySelectorAll('.icon-btn');
    iconBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // User profile click
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function() {
        showNotification('Opening profile settings...', 'info');
    });

    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    notificationBtn.addEventListener('click', function() {
        showNotification('You have 3 new notifications', 'info');
    });

    // Meal items with click interaction
    const mealItems = document.querySelectorAll('.meal-item');
    mealItems.forEach(item => {
        item.addEventListener('click', function() {
            const mealName = this.querySelector('.meal-name').textContent;
            showNotification(`Viewing details for: ${mealName}`, 'info');
            
            // Scale animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Workout items with hover effects
    const workoutItems = document.querySelectorAll('.workout-item');
    workoutItems.forEach(item => {
        item.addEventListener('click', function() {
            const workoutName = this.querySelector('.workout-name').textContent;
            showNotification(`Starting workout: ${workoutName}`, 'success');
        });
    });

    // Menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menuName = this.querySelector('h4').textContent;
            showNotification(`Added to meal plan: ${menuName}`, 'success');
        });
    });

    // Exercise items
    const exerciseItems = document.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => {
        item.addEventListener('click', function() {
            const exerciseName = this.querySelector('h4').textContent;
            showNotification(`Starting exercise: ${exerciseName}`, 'success');
        });
    });

    // Dropdown button
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', function() {
            const options = ['This Week', 'Last Week', 'This Month', 'Last Month'];
            const currentText = this.textContent.replace(' ▾', '');
            const currentIndex = options.indexOf(currentText);
            const nextIndex = (currentIndex + 1) % options.length;
            
            this.textContent = options[nextIndex] + ' ▾';
            showNotification(`Viewing: ${options[nextIndex]}`, 'info');
        });
    }

    // Promo button
    const promoBtn = document.querySelector('.promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', function() {
            this.textContent = 'Claimed! ✓';
            this.style.backgroundColor = '#B8D954';
            this.style.color = 'white';
            this.disabled = true;
            showNotification('Welcome! Your 1-month free access has been activated! 🎉', 'success');
        });
    }

    // Activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            showNotification('Viewing activity details...', 'info');
        });
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 500);
        }
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

// Perform search
function performSearch(query) {
    console.log('Searching for:', query);
    showNotification(`Searching for: "${query}"...`, 'info');
    
    // Simulate search results
    setTimeout(() => {
        showNotification(`Found 12 results for "${query}"`, 'success');
    }, 1000);
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .breakdown-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width || getComputedStyle(bar).width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });

    // Animate sleep chart bars
    const sleepBars = document.querySelectorAll('.sleep-chart .bar');
    sleepBars.forEach((bar, index) => {
        const originalHeight = getComputedStyle(bar).height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.height = originalHeight;
        }, 100 + (index * 50));
    });
}

// Animate cards on load
function animateCards() {
    const cards = document.querySelectorAll('.stat-card, .card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Animate numerical values
function animateValue(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.childNodes[0] && element.childNodes[0].nodeType === 3) {
            element.childNodes[0].textContent = value;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Update date and time
function updateDateTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Update any time displays
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(el => {
            el.textContent = timeString;
        });
    }
    
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
}

// Simulate data updates
function simulateDataUpdates() {
    // Update steps every 30 seconds
    setInterval(() => {
        const stepsCard = document.querySelector('.stat-card:nth-child(2)');
        if (stepsCard) {
            const stepsValue = stepsCard.querySelector('.stat-value');
            const currentSteps = parseInt(stepsValue.childNodes[0].textContent);
            
            if (currentSteps < 10000) {
                const newSteps = Math.min(currentSteps + Math.floor(Math.random() * 50), 10000);
                stepsValue.childNodes[0].textContent = newSteps;
                
                // Update progress bar
                const progressBar = stepsCard.querySelector('.progress-fill');
                const percentage = (newSteps / 10000) * 100;
                progressBar.style.width = `${percentage}%`;
                
                // Update text
                const statInfo = stepsCard.querySelector('.stat-info');
                const stepsLeft = 10000 - newSteps;
                statInfo.innerHTML = `${Math.round(percentage)}% <span class="muted">${stepsLeft} steps left</span>`;
            }
        }
    }, 30000);

    // Simulate random activity updates
    setInterval(() => {
        const activities = [
            '🏃 Completed 5 minute workout',
            '🥗 Logged a healthy snack',
            '💧 Drank 250ml of water',
            '📊 Updated fitness goals'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        console.log('New activity:', randomActivity);
    }, 60000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = 'ℹ️';
    let bgColor = '#4A90E2';
    
    if (type === 'success') {
        icon = '✓';
        bgColor = '#B8D954';
    } else if (type === 'error') {
        icon = '✕';
        bgColor = '#FF6B6B';
    } else if (type === 'warning') {
        icon = '⚠';
        bgColor = '#FF9F43';
    }
    
    notification.innerHTML = `
        <span style="margin-right: 8px;">${icon}</span>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${bgColor};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add smooth scrolling
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

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Window resized - Adjusting layouts');
        
        // Adjust layouts based on screen size
        const width = window.innerWidth;
        
        if (width < 768) {
            console.log('Mobile layout activated');
        } else if (width < 1024) {
            console.log('Tablet layout activated');
        } else {
            console.log('Desktop layout activated');
        }
    }, 250);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        searchInput.focus();
        showNotification('Search activated - Press Enter to search', 'info');
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-box input');
        if (searchInput.value) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
    
    // Ctrl/Cmd + H for home/dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        const dashboardLink = document.querySelector('.nav-item.active');
        if (dashboardLink) {
            dashboardLink.click();
            showNotification('Navigated to Dashboard', 'info');
        }
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        pointer-events: auto;
        cursor: pointer;
    }
    
    .notification:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// Handle page visibility
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - Pausing updates');
    } else {
        console.log('Page visible - Resuming updates');
        showNotification('Welcome back!', 'info');
    }
});

// Export functions for external use
window.NutrigoApp = {
    showNotification,
    updateMealList,
    navigateMonth,
    performSearch
};

// Log initialization complete
console.log('✓ Nutrigo Dashboard fully loaded and interactive!');
console.log('✓ All features initialized successfully');
console.log('✓ Keyboard shortcuts: Ctrl+K (Search), Ctrl+H (Home), Esc (Close)');

// Welcome message after everything loads
setTimeout(() => {
    showNotification('Welcome to Nutrigo! 🍊 Your health journey starts here.', 'success');
}, 500);