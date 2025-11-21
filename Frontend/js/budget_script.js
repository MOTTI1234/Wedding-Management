// budget_script.js

// קבלת הפניות לאלמנטים ב-DOM
const expenseForm = document.getElementById('expenseForm');
const expensesTableBody = document.getElementById('expensesTableBody');

// אלמנטים חדשים לסיכום ולעדכון תקציב
const totalBudgetEl = document.getElementById('totalBudget');
const totalPaidEl = document.getElementById('totalPaid');
const totalPendingEl = document.getElementById('totalPending');
const remainingBudgetEl = document.getElementById('remainingBudget');
const progressTextEl = document.getElementById('progressText');
const progressBarEl = document.getElementById('progressBar');
const progressLabelEl = document.getElementById('progressLabel');

// אלמנטים לעדכון התקציב
const editBudgetBtn = document.getElementById('editBudgetBtn');
const saveBudgetBtn = document.getElementById('saveBudgetBtn');
const budgetInputArea = document.getElementById('budgetInputArea');
const newBudgetAmountInput = document.getElementById('newBudgetAmount');

// משתנים גלובליים לשמירת הנתונים הפיננסיים
let totalBudget = Number(localStorage.getItem('totalBudget')) || 250000;
let totalPaid = Number(localStorage.getItem('totalPaid')) || 0;
let totalPending = Number(localStorage.getItem('totalPending')) || 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// =======================================================
// פונקציות עזר
// =======================================================

/**
 * פונקציה לעיצוב מספר (סכום כסף).
 * @param {number} amount - הסכום.
 * @returns {string} - סכום מעוצב עם ₪.
 */
function formatCurrency(amount) {
    return `₪ ${Number(amount).toLocaleString('he-IL')}`;
}

/**
 * פונקציה לעיצוב תאריך לפורמט ישראלי (DD/MM/YYYY).
 * @param {string} dateString - תאריך בפורמט ISO (YYYY-MM-DD).
 * @returns {string} - תאריך מעוצב.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('he-IL');
}

/**
 * מציגה את השורה בטבלה.
 * @param {Object} expense - אובייקט ההוצאה.
 */
function renderExpenseRow(expense) {
    // יצירת שורה חדשה (<tr>)
    const newRow = expensesTableBody.insertRow();
    
    // קטגוריה (תא 0)
    newRow.insertCell(0).innerHTML = expense.category;

    // סכום (תא 1)
    newRow.insertCell(1).innerHTML = formatCurrency(expense.amount);
    
    // תאריך (תא 2)
    newRow.insertCell(2).innerHTML = formatDate(expense.date); 
    
    // סטטוס (תא 3)
    let cell4 = newRow.insertCell(3);
    cell4.innerHTML = (expense.status === 'paid' ? 'שולם' : 'טרם שולם');
    cell4.classList.add(expense.status); // מוסיף קלאס לצבע ירוק/אדום
    
    // הערות (תא 4)
    newRow.insertCell(4).innerHTML = expense.notes || '-'; // מציג מקף אם אין הערות
}


// =======================================================
// לוגיקת עדכון תקציב
// =======================================================

/**
 * מעדכנת את כלל הסכומים המוצגים על המסך ואת פס ההתקדמות.
 */
function updateAllSummaries() {
    const totalSpent = totalPaid + totalPending;
    const remainingBudget = totalBudget - totalSpent;

    totalBudgetEl.textContent = formatCurrency(totalBudget);
    totalPaidEl.textContent = formatCurrency(totalPaid);
    totalPendingEl.textContent = formatCurrency(totalPending);
    remainingBudgetEl.textContent = formatCurrency(remainingBudget);
    remainingBudgetEl.parentElement.classList.remove('remaining');
    remainingBudgetEl.parentElement.classList.remove('spent');
    remainingBudgetEl.parentElement.classList.add(remainingBudget >= 0 ? 'remaining' : 'spent');


    // חישוב אחוז ניצול
    const usagePercent = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
    
    progressTextEl.textContent = `% מהתקציב נוצל: ${usagePercent.toFixed(1)}%`;
    progressBarEl.style.width = `${usagePercent}%`;
    progressLabelEl.textContent = `${usagePercent.toFixed(1)}%`;

    // שמירה ב-localStorage
    localStorage.setItem('totalBudget', totalBudget);
    localStorage.setItem('totalPaid', totalPaid);
    localStorage.setItem('totalPending', totalPending);
}

// לוגיקה לעדכון סכום התקציב
editBudgetBtn.addEventListener('click', () => {
    budgetInputArea.style.display = 'block';
    newBudgetAmountInput.value = totalBudget;
    newBudgetAmountInput.focus();
});

saveBudgetBtn.addEventListener('click', () => {
    const newAmount = Number(newBudgetAmountInput.value);
    
    if (newAmount > 0) {
        totalBudget = newAmount;
        updateAllSummaries();
        budgetInputArea.style.display = 'none';
        alert('התקציב הכולל עודכן בהצלחה!');
    } else {
        alert('אנא הזן סכום תקציב חוקי.');
    }
});


// =======================================================
// לוגיקת טופס ההוצאות
// =======================================================

/**
 * מטפלת בשליחת הטופס, אוספת נתונים ומוסיפה שורה לטבלה.
 * @param {Event} e - אובייקט האירוע.
 */
function handleFormSubmit(e) {
    e.preventDefault(); 

    // 1. קבלת הערכים מהטופס
    const category = document.getElementById('expenseCategory').value;
    const amount = Number(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const notes = document.getElementById('expenseNotes').value;
    const status = document.getElementById('expenseStatus').value;
    
    // 2. יצירת אובייקט הוצאה חדש
    const newExpense = { category, amount, date, status, notes };

    // 3. הוספת האובייקט למערך ושמירה
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // 4. עדכון הסיכומים
    if (status === 'paid') {
        totalPaid += amount;
    } else {
        totalPending += amount;
    }
    updateAllSummaries();
    
    // 5. רינדור השורה בטבלה
    renderExpenseRow(newExpense);

    // 6. איפוס הטופס
    expenseForm.reset();
}

// =======================================================
// אתחול האפליקציה (כאשר הדף נטען)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. טעינת ההוצאות הקיימות ורינדורן
    expenses.forEach(renderExpenseRow);
    
    // 2. עדכון סכומי הסיכום הראשוניים
    updateAllSummaries();

    // 3. האזנה לאירוע שליחת הטופס
    expenseForm.addEventListener('submit', handleFormSubmit);
});