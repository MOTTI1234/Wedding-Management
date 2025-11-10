const { connectDB } = require('./db');
const User = require('./User'); // וודא שהנתיב נכון

async function insertNewUser() {
    // 1. התחברות לבסיס הנתונים וסינכרון טבלאות
    await connectDB();

    console.log('Attempting to insert a new user...');

    try {
        // 2. הפעולה הנדרשת: יצירת שורה חדשה בטבלת Users
        const newUser = await User.create({
            username: 'RefaelK',
            email: 'refael@wedding-manage.com',
            password: 'MySecretPassword123'
        });

        console.log('✅ User inserted successfully! Data:', newUser.toJSON());

    } catch (error) {
        // זה יקרה אם המשתמש כבר קיים (username או email כבר בשימוש)
        console.error('❌ Error during user insertion:', error.message);
    }
}

insertNewUser(); // הפעלת הפונקציה

