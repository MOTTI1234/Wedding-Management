// auth.controller.js - קוד מתוקן עבור Sequelize

// 1. ייבוא מודל המשתמש (וודא שהנתיב לקובץ User.js נכון)
const User = require('../User'); // שינוי: הניחו שזה הנתיב הנכון למודל User.js
// 2. ספריית bcryptjs להצפנת סיסמאות (נשארת כפי שהיא)
const bcrypt = require('bcryptjs'); 


exports.register = async (req, res) => {
    try {
        // --- 1. קבלת נתונים ---
        // הנתונים האלה מגיעים מהטופס בדף index.html
        // הערה: הטופס שולח 'fullName' אך הבקר מצפה ל-'name'. נניח שהם זהים.
        const { email, password, name } = req.body; 

        // --- 2. אימות ובדיקת כפילויות ---
        if (!email || !password || !name) {
            return res.status(400).json({ msg: 'Please enter all fields (Name, Email, Password).' });
        }
        
        // **תיקון Sequelize:** שימוש ב-findOne עם where
        let userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists with this email.' });
        }

        // --- 3. הצפנת הסיסמה ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- 4. יצירת מופע ושמירה ---
        // **תיקון Sequelize:** שימוש ב-create(). שימו לב: המודל מצפה ל-'username', לכן משתמשים ב-'name' שקיבלנו.
        const savedUser = await User.create({
            username: name,  // משתמשים בשדה 'name' שהגיע בבקשה עבור השדה 'username' במודל
            email,
            password: hashedPassword // שומרים את הסיסמה המוצפנת בלבד!
        });

        // --- 5. שליחת תגובת הצלחה ---
        res.status(201).json({ 
            message: 'User registered successfully!',
            user: {
                id: savedUser.id, // משתמשים ב-id של Sequelize
                name: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        // --- 6. טיפול בשגיאות ---
        console.error(error);
        // שגיאת 500 כללית, או שגיאת 400 אם יש שגיאת ולידציה של Sequelize
        res.status(500).json({ error: 'Server error during registration process.' });
    }
};


// ----- פונקציית התחברות חדשה (LOGIN) -----
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. בדיקה שכל השדות נשלחו
        if (!email || !password) {
            return res.status(400).json({ msg: 'נא להזין אימייל וסיסמה.' });
        }

        // 2. מציאת המשתמש ב-PostgreSQL באמצעות Sequelize
        const user = await User.findOne({ where: { email } });

        // אם המשתמש לא נמצא
        if (!user) {
            // רצוי להחזיר הודעה כללית למטרת אבטחה
            return res.status(400).json({ msg: 'אימייל או סיסמה שגויים.' });
        }

        // 3. השוואת סיסמאות מוצפנות
        // bcrypt.compare משווה את הסיסמה הנשלחת (password) להצפנה השמורה (user.password)
        const isMatch = await bcrypt.compare(password, user.password);

        // אם הסיסמאות לא תואמות
        if (!isMatch) {
            return res.status(400).json({ msg: 'אימייל או סיסמה שגויים.' });
        }

        // 4. הצלחה: שליחת תגובה או יצירת טוקן
        
        // --- אופציה בסיסית: שליחת הצלחה ---
        res.status(200).json({ 
            message: 'התחברות בוצעה בהצלחה!',
            user: {
                id: user.id,
                email: user.email,
                username: user.username // שם המשתמש מגיע מהשדה ב-PostgreSQL
            }
        });
        
        /* --- אופציה מומלצת: יצירת JWT ושליחתו ---
        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'MySecretKey', { expiresIn: '1h' });
        // res.status(200).json({ token, message: 'התחברות בוצעה בהצלחה!' });
        */

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'שגיאת שרת במהלך ההתחברות.' });
    }
};