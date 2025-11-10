// login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // רג'קס בסיסי לבדיקת תבנית אימייל
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const MIN_PASSWORD_LENGTH = 6;

    function validateForm() {
        let isValid = true;

        // אימות אימייל
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'אנא הזן כתובת אימייל חוקית.';
            isValid = false;
        } else {
            emailError.textContent = ''; 
        }

        // אימות סיסמה
        if (passwordInput.value.length < MIN_PASSWORD_LENGTH) {
            passwordError.textContent = `הסיסמה חייבת להיות באורך של ${MIN_PASSWORD_LENGTH} תווים לפחות.`;
            isValid = false;
        } else {
            passwordError.textContent = ''; 
        }

        return isValid;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // חובה למנוע את השליחה המקורית של הטופס

        if (validateForm()) {
            // --- לוגיקת ניתוב לאחר אימות צד-לקוח מוצלח ---

            // *הערה: ביישום אמיתי, כאן היית שולח את הנתונים לשרת 
            // באמצעות Fetch API, ומבצע את הניתוב רק אם השרת החזיר הצלחה.
            
            // מכיוון שאנחנו עושים רק אימות לקוח:
            
            console.log('Client-side validation successful. Redirecting...');
            
            // ניתוב לדף homePage.html
            window.location.href = 'homePage.html'; 
            
        } else {
            console.log('Client-side validation failed.');
        }
    });
});