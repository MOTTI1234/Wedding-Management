// server.js (הקוד המומלץ והמתוקן)

const express = require('express');
const path = require('path'); // נחוץ לטיפול בנתיבים
const { connectDB } = require('./db');
const authRoutes = require('./auth.routes.js'); // ייבוא ראוטרים לאימות

const app = express();
const PORT = process.env.PORT || 3000; // אפשרות להגדיר פורט דרך משתני סביבה

// --- Middlewares ---
// 1. טיפול ב-JSON (מחליף את body-parser.json())
app.use(express.json()); 
// 2. הגשת קבצים סטטיים (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); 

// --- חיבור ראוטרים ---
// כל הניתובים לאימות (הרשמה/התחברות) יתחילו ב-/api/auth
app.use('/api/auth', authRoutes); 

// --- הפעלת השרת ---
async function startServer() {
    try {
        await connectDB(); // מנסה להתחבר לבסיס הנתונים (PostgreSQL) ולסנכרן
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        // אפשר להוסיף כאן לוגיקה ליציאה מהאפליקציה אם החיבור לבסיס הנתונים נכשל
    }
}

startServer();