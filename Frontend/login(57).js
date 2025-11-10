// login.js - לוגיקת ההתחברות בצד הלקוח

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageContainer = document.getElementById('messageContainer'); // נוסיף div לתצוגת הודעות

// ודא שיש ב-login(54).html אלמנט עם id="messageContainer"
// לדוגמה: <div id="messageContainer" class="msg" hidden></div> 

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. איסוף נתונים
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        messageContainer.textContent = 'נא להזין אימייל וסיסמה.';
        messageContainer.className = 'msg error';
        messageContainer.hidden = false;
        return;
    }

    messageContainer.textContent = 'מתחבר...';
    messageContainer.className = 'msg info';
    messageContainer.hidden = false;


    try {
        // 2. שליחת בקשת POST לשרת
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // 3. טיפול בתגובה מהשרת
        if (response.ok) { // קוד 200 OK
            messageContainer.textContent = data.message || 'התחברת בהצלחה!';
            messageContainer.className = 'msg success';
            // אם קיבלנו JWT, נשמור אותו כאן ב-localStorage או ב-Cookies
            // if (data.token) { localStorage.setItem('token', data.token); }
            
            // הפנייה לדף הראשי לאחר 1.5 שניות
            setTimeout(() => {
                 window.location.href = '/dashboard.html'; // שנה ליעד המתאים
            }, 1500);

        } else {
            // קוד שגיאה (400)
            messageContainer.textContent = data.msg || data.error || 'שגיאה בהתחברות.';
            messageContainer.className = 'msg error';
        }

    } catch (error) {
        console.error('Fetch error:', error);
        messageContainer.textContent = 'שגיאה בחיבור לשרת.';
        messageContainer.className = 'msg error';
    }
});