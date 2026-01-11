import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs";

const tasksFile = "./tasks.json";

// Check if the file exists in the current directory.
fs.access(tasksFile, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
  }
});

let tasks = JSON.parse(fs.readFileSync(tasksFile, "utf-8"));

const saveTasks = () => {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

const main = async () => {
  const answer = await select({
    message: chalk.blue("Select your option: "),
    choices: [
      {
        name: "add",
        value: "add",
        description: "Add a new task",
      },
      {
        name: "update",
        value: "update",
        description: "Update an existing task",
      },
      {
        name: "delete",
        value: "delete",
        description: "Delete a task",
      },
      {
        name: "mark as done",
        value: "mark as done",
        description: "Mark a task as completed",
      },
      {
        name: "view tasks",
        value: "view tasks",
        description: "View all tasks",
      },
      {
        name: "exit",
        value: "exit",
        description: "Exit the application",
      },
    ],
  });

  switch (answer) {
    case "add":
      await add();
      break;
    case "update":
      await update();
      break;
    case "delete":
      await deleteTask();
      break;
    case "mark as done":
      await markAsDone();
      break;
    case "view tasks":
      viewTasks();
      break;
    case "exit":
      process.exit();
    default:
      console.log(chalk.red("Invalid option selected."));
      break;
  }

  main();
};

const add = async () => {
  const taskName = await input({
    message: chalk.green("Enter your task: "),
    validate: (value) => (value.trim() ? true : "Task name cannot be empty"),
  });

  const taskDescription = await input({
    message: chalk.green("Enter task description (optional): "),
  });

  tasks.push({
    name: taskName,
    description: taskDescription,
    completed: false,
  });

  saveTasks();
  console.log(chalk.yellow("Task added successfully!"));
};

const update = async () => {
  if (tasks.length === 0) {
    console.log(chalk.red("No tasks available to update."));
    return;
  }

  const selectedTask = await select({
    message: chalk.blue("Select a task to update"),
    choices: tasks.map((task, index) => {
      return {
        name: task.name,
        value: index,
        description: chalk.dim(task.description || "No description"),
      };
    }),
  });

  const newTask = await input({
    message: chalk.green("Enter the new task name: "),
    validate: (value) => (value.trim() ? true : "Task name cannot be empty"),
  });

  const taskDescription = await input({
    message: chalk.green("Enter task description (optional): "),
  });

  if (selectedTask >= 0 && selectedTask < tasks.length) {
    tasks[selectedTask] = {
      ...tasks[selectedTask],
      name: newTask,
      description: taskDescription,
    };
    saveTasks();
    console.log(chalk.yellow("Task updated successfully!"));
  } else {
    console.log(chalk.red("Invalid task selected."));
    return;
  }
};

const deleteTask = async () => {
  if (tasks.length === 0) {
    console.log(chalk.red("No tasks available to delete."));
    return;
  }

  const selectedTask = await select({
    message: chalk.blue("Select a task to delete"),
    choices: tasks.map((task, index) => {
      return {
        name: task.name,
        value: index,
        description: chalk.dim(task.description || "No description"),
      };
    }),
  });

  if (selectedTask >= 0 && selectedTask < tasks.length) {
    tasks.splice(selectedTask, 1);
    saveTasks();
    console.log(chalk.yellow("Task deleted successfully!"));
  } else {
    console.log(chalk.red("Invalid task selected."));
    return;
  }
};

const markAsDone = async () => {
  if (tasks.length === 0) {
    console.log(chalk.red("No tasks available to mark as done."));
    return;
  }

  const selectedTask = await select({
    message: chalk.blue("Select a task to mark as done"),
    choices: tasks.map((task, index) => {
      return {
        name: task.name,
        value: index,
        description: chalk.dim(task.description || "No description"),
      };
    }),
  });

  if (selectedTask >= 0 && selectedTask < tasks.length) {
    tasks[selectedTask].completed = true;
    saveTasks();
    console.log(chalk.yellow("Task marked as done successfully!"));
  } else {
    console.log(chalk.red("Invalid task selected."));
    return;
  }
};

const viewTasks = () => {
  if (tasks.length === 0) {
    console.log(chalk.red("No tasks available to view."));
    return;
  }

  tasks.forEach((task, index) => {
    console.log(
      chalk.green(`Task ${index + 1}: ${task.name}`) +
        (task.completed ? chalk.green(" \u2714") : "")
    );
    console.log(chalk.dim(task.description || "No description"));
  });
};

main();
