// controllers/expense.controller.js
const Expense = require('../models/Expense');

/**
 * שליפת כל ההוצאות של המשתמש
 */
exports.getExpenses = async (req, res) => {
    try {
        const UserId = req.user.id;
        const expenses = await Expense.findAll({
            where: { UserId },
            order: [['date', 'DESC']]
        });
        res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: 'שגיאת שרת פנימית בעת שליפת ההוצאות.' });
    }
};

/**
 * יצירת הוצאה חדשה
 */
exports.createExpense = async (req, res) => {
    try {
        const { category, amount, date, status, notes } = req.body;
        const UserId = req.user.id;

        if (!category || !amount || !date || !status) {
            return res.status(400).json({ msg: 'נא למלא את כל שדות החובה של ההוצאה.' });
        }

        const parsedAmount = parseInt(amount, 10);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ msg: 'סכום ההוצאה חייב להיות מספר חיובי תקין.' });
        }

        const newExpense = await Expense.create({
            category,
            amount: parsedAmount,
            date,
            status,
            notes: notes || null,
            UserId
        });

        res.status(201).json({
            message: 'הוצאה נשמרה בהצלחה!',
            expense: newExpense
        });
    } catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ error: 'שגיאת שרת פנימית בעת שמירת ההוצאה.' });
    }
};

/**
 * מחיקת הוצאה
 */
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const UserId = req.user.id;

        const expense = await Expense.findOne({ where: { id, UserId } });
        if (!expense) {
            return res.status(404).json({ msg: 'הוצאה לא נמצאה או אינך מורשה למחוק אותה.' });
        }

        await expense.destroy();
        res.status(200).json({ message: 'ההוצאה נמחקה בהצלחה.' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: 'שגיאת שרת פנימית בעת מחיקת ההוצאה.' });
    }
};

/**
 * עדכון הוצאה
 */
exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount, date, status, notes } = req.body;
        const UserId = req.user.id;

        const expense = await Expense.findOne({ where: { id, UserId } });
        if (!expense) {
            return res.status(404).json({ msg: 'הוצאה לא נמצאה או אינך מורשה לעדכן אותה.' });
        }

        if (amount !== undefined) {
            const parsedAmount = parseInt(amount, 10);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({ msg: 'סכום ההוצאה חייב להיות מספר חיובי תקין.' });
            }
            expense.amount = parsedAmount;
        }

        if (category) expense.category = category;
        if (date) expense.date = date;
        if (status) expense.status = status;
        if (notes !== undefined) expense.notes = notes;

        await expense.save();

        res.status(200).json({
            message: 'ההוצאה עודכנה בהצלחה!',
            expense
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: 'שגיאת שרת פנימית בעת עדכון ההוצאה.' });
    }
};
