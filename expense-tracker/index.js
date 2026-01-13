#!/usr/bin/env node
const { Command } = require("commander");
require("./utils.js");
const { addExpanse, viewAll, deleteExpense, summary } = require("./utils");
const program = new Command();

program
  .name("expense-tracker")
  .usage("<command> [options]")
  .description("A simple expense tracker to manage your finances.")
  .version("1.0.0");

program
  .command("add")
  .description("Add an expense")
  .option("-d, --description <string>", "expense description")
  .option("-a, --amount <number>", "expense amount")
  .action((options) => {
    if (!options.description || !options.amount) {
      console.error("Both --description and --amount are required");
      process.exit(1);
    }

    addExpanse(options);
  });

program
  .command("delete")
  .description("Delete an expense")
  .option("--id <number>", "expense id")
  .action((options) => {
    if (!options.id) {
      console.error("Id is required");
      process.exit(1);
    }

    if (isNaN(options.id)) {
      console.error("Id must be a number");
      process.exit(1);
    }

    if (options.id <= 0) {
      console.error("Id must be greater than 0");
      process.exit(1);
    }

    deleteExpense(options.id);
  });

program
  .command("summary")
  .description("View expense summary")
  .option("--month <number>", "month in number (1-12)")
  .action((options) => {
    const month = parseInt(options.month);

    if (!month) {
      summary();
      return;
    }

    if (month && (month < 1 || month > 12)) {
      console.error("Month must be between 1 and 12");
      process.exit(1);
    }

    if (isNaN(month)) {
      console.error("Month must be a number");
      process.exit(1);
    }

    summary(month);
  });

program
  .command("list")
  .description("View all expenses")
  .action(() => {
    viewAll();
  });

program.parse();
