const { Sequelize } = require('sequelize');

// הגדרות החיבור לבסיס הנתונים שלך
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
    host: 'localhost', // בדרך כלל localhost או כתובת השרת
    dialect: 'postgres' // סוג בסיס הנתונים
});

// פונקציה לבדיקת החיבור
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL established successfully.');
        // מסנכרן את המודלים עם בסיס הנתונים (יוצר טבלאות אם אינן קיימות)
        await sequelize.sync(); 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, connectDB };