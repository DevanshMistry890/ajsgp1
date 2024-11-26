const validateTask = (req, res, next) => {
  const { description, assignedTo, dueDate, priority, status } = req.body;

  if (!description || !assignedTo || !dueDate || !priority || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  const validStatuses = ['not started', 'in progress', 'completed'];

  if (!validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dueDate)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  next();
};

module.exports = { validateTask };
