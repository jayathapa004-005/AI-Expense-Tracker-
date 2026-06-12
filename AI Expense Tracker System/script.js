const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.getElementById("expenseTableBody");

const totalExpense = document.getElementById("totalExpense");
const totalEntries = document.getElementById("totalEntries");

const filterCategory = document.getElementById("filterCategory");

const aiButton = document.getElementById("aiButton");
const aiResult = document.getElementById("aiResult");

let expenseList = [];

window.addEventListener("DOMContentLoaded", () => {
    showExpenses();
});

expenseForm.addEventListener("submit", addExpense);

filterCategory.addEventListener("change", filterExpenses);

aiButton.addEventListener("click", generateInsight);

function addExpense(event) {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();

    const amount = document.getElementById("amount").value;

    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    const note = document.getElementById("note").value.trim();

    const expense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category,
        date,
        note
    };

    expenseList.push(expense);

    updateSummary();

    showExpenses();

    expenseForm.reset();
}

function showExpenses(filteredData = expenseList) {

    expenseTableBody.innerHTML = "";

    if (filteredData.length === 0) {

        expenseTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No expenses added yet
                </td>
            </tr>
        `;

        return;
    }

    filteredData.forEach((expense) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.title}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>${expense.note || "-"}</td>
            <td>
                <button 
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>
            </td>
        `;

        expenseTableBody.appendChild(row);
    });
}

function deleteExpense(id) {

    expenseList = expenseList.filter((expense) => {
        return expense.id !== id;
    });

    updateSummary();

    filterExpenses();
}

function updateSummary() {

    let total = 0;

    expenseList.forEach((expense) => {
        total += expense.amount;
    });

    totalExpense.textContent = `₹${total}`;

    totalEntries.textContent = expenseList.length;
}

function filterExpenses() {

    const selectedCategory = filterCategory.value;

    if (selectedCategory === "All") {
        showExpenses();
        return;
    }

    const filteredData = expenseList.filter((expense) => {
        return expense.category === selectedCategory;
    });

    showExpenses(filteredData);
}

function generateInsight() {

    if (expenseList.length === 0) {

        aiResult.innerHTML =
            "Add some expenses first to generate AI insight.";

        return;
    }

    let totalAmount = 0;

    const categoryWiseExpense = {};

    expenseList.forEach((expense) => {

        totalAmount += expense.amount;

        if (categoryWiseExpense[expense.category]) {

            categoryWiseExpense[expense.category] += expense.amount;

        } else {

            categoryWiseExpense[expense.category] = expense.amount;
        }
    });

    let highestCategory = "";
    let highestAmount = 0;

    for (let category in categoryWiseExpense) {

        if (categoryWiseExpense[category] > highestAmount) {

            highestAmount = categoryWiseExpense[category];
            highestCategory = category;
        }
    }

    aiResult.innerHTML = `
        <strong>Total Spending:</strong> ₹${totalAmount}
        <br><br>

        <strong>Highest Spending Category:</strong> 
        ${highestCategory}
        <br><br>

        <strong>Insight:</strong>
        You are spending more on 
        <b>${highestCategory}</b>. 
        Try reducing unnecessary expenses in this category 
        to improve savings.
    `;
}