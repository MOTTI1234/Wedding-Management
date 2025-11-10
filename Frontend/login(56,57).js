// login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // ביישום אמיתי, מומלץ להציג הודעת שגיאה כללית בטופס (נוסיף כאן placeholder)
    // const formMessage = document.getElementById('formMessage'); 

    // רג'קס בסיסי לבדיקת תבנית אימייל
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const MIN_PASSWORD_LENGTH = 6;

    function validateForm() {
        let isValid = true;
        // formMessage.textContent = ''; // נקה הודעה כללית

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
    
    // פונקציה אסינכרונית לשליחת הנתונים לשרת
    async function submitLoginForm(email, password) {
        // ביישום אמיתי: כאן ניתן להפעיל אינדיקטור טעינה ולנטרל את כפתור השליחה
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) { // קוד סטטוס 200-299: הצלחה
                console.log('Login successful on server. Redirecting...');
                // ** ניתוב לדף הבית לאחר אישור השרת **
                window.location.href = 'homePage.html'; 
            } else {
                // קוד סטטוס 4xx: כשלון אימות (לדוגמה: 401 Unauthorized)
                const errorData = await response.json().catch(() => ({})); // מנסה לקרוא גוף, אם נכשל מחזיר אובייקט ריק
                
                const errorMessage = errorData.message || 'שם משתמש או סיסמה שגויים. נסה שוב.';
                alert(`Login failed: ${errorMessage}`);
                // formMessage.textContent = errorMessage; // הצגת הודעה כללית בטופס
            }
        } catch (error) {
            // שגיאות רשת או שרת שאינן קשורות לתגובה (לדוגמה, השרת לא זמין)
            console.error('Network or server error:', error);
            alert('אירעה שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.');
        } finally {
            // ביישום אמיתי: כאן ניתן לנטרל את אינדיקטור הטעינה ולהפעיל מחדש את כפתור השליחה
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // מונע שליחת טופס רגילה

        if (validateForm()) {
            // אם האימות בצד הלקוח הצליח, שולחים לשרת
            submitLoginForm(emailInput.value, passwordInput.value);
        }
    });
});