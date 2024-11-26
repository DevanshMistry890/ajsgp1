const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE =
  process.env.NODE_ENV === 'test'
    ? path.join(__dirname, '../data/test_tasks.json')
    : path.join(__dirname, '../data/tasks.json');

class Task {
  static async readTasksFile() {
    try {
      await fs.access(TASKS_FILE);
      const data = await fs.readFile(TASKS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(TASKS_FILE, '[]');
        return [];
      }
      throw error;
    }
  }

  static async writeTasksFile(tasks) {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
  }

  static async findAll() {
    return await this.readTasksFile();
  }

  static async findById(id) {
    const tasks = await this.readTasksFile();
    return tasks.find((task) => task.id === id);
  }

  static async create(taskData) {
    const tasks = await this.readTasksFile();
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await this.writeTasksFile(tasks);
    return newTask;
  }

  static async update(id, taskData) {
    const tasks = await this.readTasksFile();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return null;

    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData,
      id,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    await this.writeTasksFile(tasks);
    return updatedTask;
  }

  static async delete(id) {
    const tasks = await this.readTasksFile();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return false;

    tasks.splice(taskIndex, 1);
    await this.writeTasksFile(tasks);
    return true;
  }
}

module.exports = Task;
