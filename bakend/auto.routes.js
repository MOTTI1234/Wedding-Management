// auth.routes.js

const express = require('express');
const router = express.Router();
// ייבוא פונקציית ההרשמה מהבקר (הקובץ הבא)
const authController = require('./auth.controller.js'); 

// מגדיר ראוט מסוג POST עבור ההרשמה.
// כאשר לקוח שולח בקשת POST לכתובת זו, הפונקציה register מופעלת.
router.post('/register', authController.register);

// ראוט התחברות חדש
router.post('/login', authController.login); // מוסיף ראוט POST חדש

module.exports = router;

// הערה: קובץ זה צריך להיות מחובר לאפליקציה הראשית שלך (server.js/app.js) באמצעות app.use('/api/auth', authRouter);