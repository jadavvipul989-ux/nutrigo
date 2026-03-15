document.addEventListener('DOMContentLoaded', () => {
    // Set today's date in the log form when the page loads
    document.getElementById('date').valueAsDate = new Date();
    
    // --- PROFILE FORM LOGIC (TDEE Calculation) ---
    const profileForm = document.getElementById('profile-form');
    const tdeeOutput = document.getElementById('tdee-output');
    
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725
    };

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const activity = document.getElementById('activity').value;

        // Mifflin-St Jeor BMR formula
        let bmr;
        if (gender === 'male') {
            // BMR = 10 * weight + 6.25 * height - 5 * age + 5
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            // BMR = 10 * weight + 6.25 * height - 5 * age - 161
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        const tdee = Math.round(bmr * activityMultipliers[activity]);
        
        tdeeOutput.innerHTML = `
            Profile saved! Your **Basal Metabolic Rate (BMR)** is: **${Math.round(bmr)}** kcal/day.<br>
            Your **Total Daily Energy Expenditure (TDEE)** is: **${tdee}** kcal/day.
        `;
        tdeeOutput.style.display = 'block';

        alert('Profile updated and TDEE calculated!');
    });


    // --- DAILY LOG FORM LOGIC ---
    const logForm = document.getElementById('log-form');
    const dailyLogList = document.getElementById('daily-log-list');

    logForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const mealName = document.getElementById('meal-name').value;
        const foodId = document.getElementById('food-id').value;
        const quantity = document.getElementById('quantity').value;

        // This is a PROTOTYPE log entry. In a real app, the server calculates calories.
        const mockCalories = Math.round(Math.random() * 500) + 100;
        const mockProtein = Math.round(Math.random() * 30) + 5;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            📅 ${date} - **${mealName}**
            <br>
            **${foodId}** (${quantity}) 
            <span style="float: right;">🔥 ${mockCalories} kcal | 🥩 ${mockProtein}g Protein</span>
        `;
        
        dailyLogList.prepend(listItem); 

        // Clear only the food inputs
        document.getElementById('food-id').value = '';
        document.getElementById('quantity').value = '';
        
        alert('Food entry logged successfully!');
    });
});