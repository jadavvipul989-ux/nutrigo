document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Activation Logic (for multi-page navigation)
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    // Get the current page's filename (e.g., "new.html", "Exercises.html")
    const currentPageFilename = window.location.pathname.split('/').pop();

    sidebarLinks.forEach(link => {
        // Get the link's target filename (e.g., "new.html")
        const linkFilename = link.getAttribute('href').split('/').pop();

        // Check if the link's filename matches the current page's filename
        if (linkFilename === currentPageFilename) {
            // First, ensure all existing 'active' classes are removed (if any)
            sidebarLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            // Set the current link as active and apply the styling
            link.classList.add('active');
        }
        
        // Ensure that clicking a link handles the smooth styling (for non-full page reloads)
        // NOTE: In a multi-page setup, the styling update is redundant on click, 
        // because the page is about to reload anyway. The focus is on the page load check above.
    });


    // 2. Mobile Sidebar Toggle Logic (Stays the same)
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');

    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            document.body.addEventListener('click', closeSidebarOnClickOutside);
        } else {
            document.body.removeEventListener('click', closeSidebarOnClickOutside);
        }
    });

    function closeSidebarOnClickOutside(event) {
        if (!sidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            sidebar.classList.remove('active');
            document.body.removeEventListener('click', closeSidebarOnClickOutside);
        }
    }


    // 3. Page Functionality Logic (Keeps your original quiz/modal functions)
    const quizForm = document.getElementById('quiz-form');
    const onboardingSection = document.getElementById('onboarding-quiz');
    const dashboardSection = document.getElementById('dashboard');
    const exerciseModal = document.getElementById('exercise-modal');
    const startWorkoutButtons = document.querySelectorAll('.start-workout');
    const closeModalButton = exerciseModal.querySelector('.close-modal');

    let userProfile = {
        isPersonalized: false,
        level: '',
        goals: '',
        progressLog: []
    };

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // (Quiz submission logic)
        const goal = document.getElementById('goal').value;
        const level = 'beginner'; 
        
        userProfile.isPersonalized = true;
        userProfile.level = level;
        userProfile.goals = goal;

        const generatedPlan = generateDynamicPlan(level, goal); 
        console.log('Generated Plan:', generatedPlan);

        // UI Update
        onboardingSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        document.getElementById('user-greeting').textContent = `👋 Welcome Back, Sarah!`;
    });

    // Modal open/close logic
    startWorkoutButtons.forEach(button => {
        button.addEventListener('click', () => {
            exerciseModal.classList.remove('hidden');
        });
    });

    closeModalButton.addEventListener('click', () => {
        exerciseModal.classList.add('hidden');
    });

    // Logging & Adaptive Difficulty (SIMULATED)
    const logSetButton = exerciseModal.querySelector('.log-set');
    logSetButton.addEventListener('click', () => {
        const reps = exerciseModal.querySelector('input[placeholder="Reps"]').value;
        const weight = exerciseModal.querySelector('input[placeholder="Weight (lbs/kg)"]').value;

        userProfile.progressLog.push({ 
            exercise: 'Goblet Squat', 
            reps: reps, 
            weight: weight, 
            timestamp: new Date() 
        });

        alert(`Logged set: ${reps} reps @ ${weight} kg/lbs. Data feeding back into the AI engine!`);
    });

    // Export to Calendar (SIMULATED)
    const exportCalendarButton = document.querySelector('.export-calendar');
    exportCalendarButton.addEventListener('click', () => {
        alert("Workout plan successfully formatted for iCal/Google Calendar API and exported! Check your schedule.");
    });
    
    // Placeholder function for plan generation
    function generateDynamicPlan(level, goal) {
        if (level === 'beginner' && goal === 'weight-loss') {
            return [
                { day: 'Mon', workout: 'Full Body Dumbbells (Knee Friendly)' },
                { day: 'Wed', workout: 'Low-Impact Cardio & Core' },
                { day: 'Fri', workout: 'Upper Body Focus & Mobility' }
            ];
        }
        return [];
    }

    // Initial State (Ensures the correct sections are shown/hidden on load)
    // Note: You would likely move the content from the hidden sections (like dashboard and gamification) 
    // into their respective HTML files (new.html, Exercises.html, etc.) for a true multi-page app.
    if (currentPageFilename === 'new.html' || currentPageFilename === '') {
         // Assuming 'new.html' or index is the main dashboard
        if (!userProfile.isPersonalized) {
            dashboardSection.classList.add('hidden');
            onboardingSection.classList.remove('hidden');
        } else {
            dashboardSection.classList.remove('hidden');
            onboardingSection.classList.add('hidden');
        }
    } else {
        // Hide the dashboard/quiz modules if we are on a different page (like profile.html)
        dashboardSection.classList.add('hidden');
        onboardingSection.classList.add('hidden');
    }
});