const Table = require("cli-table3");
const fs = require("fs");

const EXPENSE_FILE = "./expense.json";
const expenses = JSON.parse(fs.readFileSync(EXPENSE_FILE, "utf-8"));

const saveExpenses = () => {
  fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
};

const addExpanse = (expanse) => {
  const { description, amount } = expanse;

  const currentExpanseIndex = expenses.length - 1;

  const id = expenses.length === 0 ? 1 : expenses[currentExpanseIndex].id + 1;
  const now = Date.now();

  expenses.push({ id, date: now, description, amount: parseInt(amount) });
  saveExpenses();

  console.log(`Expanse added successfully! (ID: ${id})`);
};

const deleteExpense = (id) => {
  if (expenses.length === 0) {
    console.log("No expenses available to delete.");
    return;
  }

  const index = expenses.findIndex((e) => e.id == parseInt(id));

  if (index === -1) {
    console.log("Expense not found.");
    return;
  }

  expenses.splice(index, 1);
  saveExpenses();
  console.log("Expense deleted successfully!");
};

const viewAll = () => {
  if (expenses.length === 0) {
    console.log(chalk.red("No expenses available to view."));
    return;
  }

  const format = (date) =>
    new Date(date).toLocaleString("en-US", { dateStyle: "short" });

  const table = new Table({
    head: ["ID", "Date", "Description", "Amount"],
  });

  expenses.forEach((e) => {
    table.push([
      e.id,
      format(e.date),
      e.description,
      `$ ${e.amount.toLocaleString("en-US")}`,
    ]);
  });

  console.log(table.toString());
};

function getMonthName(monthNumber, locale = "en-US") {
  const date = new Date(2024, monthNumber, 1);
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}

const summary = (month) => {
  if (expenses.length === 0) {
    console.log("No expenses available to view.");
    return;
  }

  if (month) {
    const total = expenses.reduce((acc, e) => {
      if (new Date(e.date).getMonth() === month - 1) {
        return acc + e.amount;
      }
      return acc;
    }, 0);

    console.log(`Total Expenses in ${getMonthName(month - 1)}: \$${total}`);
    return;
  }

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  console.log(`Total Expenses: \$${total}`);
};

module.exports = { addExpanse, viewAll, deleteExpense, summary };
