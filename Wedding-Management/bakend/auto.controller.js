// auth.controller.js

// ודא שאתה מייבא את המודולים הנדרשים:
// 1. מודל המשתמש (בהנחה שקראת לו user.model.js והוא משתמש ב-Mongoose)
const User = require('../models/user.model'); 
// 2. ספריית bcryptjs להצפנת סיסמאות
const bcrypt = require('bcryptjs'); 


exports.register = async (req, res) => {
    try {
        // --- 1. קבלת נתונים ---
        // הנתונים האלה מגיעים מהטופס בדף register(49).html
        const { email, password, name } = req.body; 

        // --- 2. אימות ובדיקת כפילויות ---
        // ודא שכל השדות נשלחו
        if (!email || !password || !name) {
            return res.status(400).json({ msg: 'Please enter all fields (Name, Email, Password).' });
        }
        
        // בדוק אם משתמש עם אותו אימייל כבר קיים במסד הנתונים
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'User already exists with this email.' });
        }

        // --- 3. הצפנת הסיסמה (Hashing) ---
        // יצירת מלח (Salt) - ככל שהמספר גבוה יותר, הגיבוב איטי יותר ובטוח יותר (10 זה סטנדרטי)
        const salt = await bcrypt.genSalt(10);
        // גיבוב הסיסמה לפני השמירה
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- 4. יצירת מופע ושמירה ---
        const newUser = new User({
            name,
            email,
            password: hashedPassword // שומרים את הסיסמה המוצפנת בלבד!
        });

        // שמירת המשתמש החדש במסד הנתונים
        const savedUser = await newUser.save();

        // --- 5. שליחת תגובת הצלחה ---
        // קוד 201 Created מציין שיצירת המשאב הצליחה
        res.status(201).json({ 
            message: 'User registered successfully!',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {
        // --- 6. טיפול בשגיאות ---
        console.error(error);
        res.status(500).json({ error: 'Server error during registration process.' });
    }
};