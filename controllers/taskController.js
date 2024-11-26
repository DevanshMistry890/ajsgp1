const Task = require('../models/Task');

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll();
      res.json(tasks);
    } catch (error) {
      console.error('Error getting all tasks:', error);
      res.status(500).json({ error: 'Failed to read tasks' });
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Error getting task by id:', error);
      res.status(500).json({ error: 'Failed to read task' });
    }
  }

  static async createTask(req, res) {
    try {
      const newTask = await Task.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  static async updateTask(req, res) {
    try {
      const updatedTask = await Task.update(req.params.id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  static async deleteTask(req, res) {
    try {
      const deleted = await Task.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  static async searchTasks(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.json(await Task.findAll());
      }

      const tasks = await Task.findAll();

      const filteredTasks = tasks.filter(
        (task) =>
          task.description.toLowerCase().includes(query.toLowerCase()) ||
          task.assignedTo.toLowerCase().includes(query.toLowerCase())
      );

      res.json(filteredTasks);
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({ error: 'Failed to search tasks' });
    }
  }
}

module.exports = TaskController;
