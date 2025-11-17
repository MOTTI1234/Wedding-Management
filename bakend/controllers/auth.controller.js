// auth.controller.js - קוד מתוקן עבור Sequelize

// 1. ייבוא מודל המשתמש (וודא שהנתיב לקובץ User.js נכון)
const User = require('../models/User'); // שינוי: הניחו שזה הנתיב הנכון למודל User.js
// 2. ספריית bcryptjs להצפנת סיסמאות (נשארת כפי שהיא)
const bcrypt = require('bcryptjs'); 



exports.register = async (req, res) => {
    //console.log("🚩 [CONTROLLER] Register function started."); // דגל 1: התחלת הפונקציה
    try {
        const { email, password, name } = req.body; 

        if (!email || !password || !name) {
            //console.log("❌ [CONTROLLER] Missing fields."); // דגל 2: שדות חסרים
            return res.status(400).json({ msg: 'Please enter all fields (Name, Email, Password).' });
        }
        
        //console.log(`🚩 [CONTROLLER] Checking if user exists: ${email}`); // דגל 3: לפני בדיקת משתמש
        let userExists = await User.findOne({ where: { email } });
        //console.log("✅ [CONTROLLER] User check complete."); // דגל 4: אחרי בדיקת משתמש (כנראה נתקע לפני זה)

        if (userExists) {
            //console.log("❌ [CONTROLLER] User already exists."); // דגל 5: משתמש קיים
            return res.status(400).json({ msg: 'User already exists with this email.' });
        }

        //console.log("🚩 [CONTROLLER] Hashing password..."); // דגל 6: לפני הצפנה
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //console.log("✅ [CONTROLLER] Password hashed."); // דגל 7: אחרי הצפנה

        //console.log("🚩 [CONTROLLER] Creating user in DB..."); // דגל 8: לפני יצירה
        const savedUser = await User.create({
            username: name,
            email,
            password: hashedPassword
        });
        //console.log("✅ [CONTROLLER] User created successfully."); // דגל 9: אחרי יצירה

        res.status(201).json({ 
            message: 'User registered successfully!',
            // ... (פרטי משתמש)
        });

    } catch (error) {
        //console.error("❌ [CONTROLLER] CATCH ERROR:", error); // דגל 10: תפיסת שגיאה
        res.status(500).json({ error: 'Server error during registration process.' });
    }
};


// ----- פונקציית התחברות חדשה (LOGIN) -----
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log("🚩 [LOGIN] Starting login process for:", email); // הדגל החדש - מיקום מומלץ
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