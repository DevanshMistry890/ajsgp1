$(document).ready(() => {
  // DOM Elements Module
  const createElementsModule = () => ({
    taskList: $('#task-list'),
    searchInput: $('#search-input'),
    searchButton: $('#search-button'),
    clearButton: $('#clear-button'),
    addTaskForm: $('#add-task-form'),
    inputs: {
      description: $('#task-description'),
      assignedTo: $('#assigned-to'),
      dueDate: $('#due-date'),
      priority: $('#priority'),
      status: $('#status'),
    },
  });

  // Colors Module
  const createColorsModule = () => ({
    priority: {
      high: 'red',
      medium: 'orange',
      low: 'green',
      default: '#ccc',
    },
    status: {
      'not started': 'gray',
      'in progress': 'blue',
      completed: 'green',
      default: '#ccc',
    },
    getForPriority(priority) {
      return this.priority[priority] || this.priority.default;
    },
    getForStatus(status) {
      return this.status[status] || this.status.default;
    },
  });

  // Task Manager Factory
  const createTaskManager = () => {
    const elements = createElementsModule();
    const colors = createColorsModule();
    let tasks = [];
    let editIndex = -1;


    const loadTasks = () => {
      const storedTasks = localStorage.getItem('tasks');
      tasks = storedTasks ? JSON.parse(storedTasks) : [];
    };

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const getTaskFromInputs = () => ({
      description: elements.inputs.description.val(),
      assignedTo: elements.inputs.assignedTo.val(),
      dueDate: elements.inputs.dueDate.val(),
      priority: elements.inputs.priority.val(),
      status: elements.inputs.status.val(),
    });

    const displayEmptyMessage = () => {
      elements.taskList.append(
        '<div class="no-tasks-message" style="text-align: center;">' +
          'No tasks available. Please add a task.</div>'
      );
    };

    const getFilteredTasks = () => {
      const searchTerm = elements.searchInput.val().toLowerCase();
      return searchTerm
        ? tasks.filter(
            (task) =>
              task.description.toLowerCase().includes(searchTerm) ||
              task.assignedTo.toLowerCase().includes(searchTerm)
          )
        : tasks;
    };

    const getTaskHTML = (task) => `
      <div class="task-description">Description: ${task.description}</div>
      <div class="task-assigned-to">Assigned to: ${task.assignedTo}</div>
      <div class="task-due-date">Due Date: ${task.dueDate}</div>
      <div class="task-priority" style="color: ${colors.getForPriority(
        task.priority
      )};">
        Priority: ${task.priority}
      </div>
      <div class="task-status" style="color: ${colors.getForStatus(
        task.status
      )};">
        Status: ${task.status}
      </div>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    `;

    const handleTaskSubmit = (event) => {
      event.preventDefault();
      const task = getTaskFromInputs();

      if (editIndex === -1) {
        tasks.push(task);
      } else {
        tasks[editIndex] = task;
        editIndex = -1;
      }

      saveTasks();
      displayTasks();
      elements.addTaskForm.trigger('reset');
    };

    const handleEdit = (index) => {
      const task = tasks[index];
      Object.entries(elements.inputs).forEach(([key, input]) => {
        input.val(task[key]);
      });
      editIndex = index;
    };

    const handleDelete = (index) => {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    };

    const createTaskElement = (task, index) => {
      const taskElement = $('<div class="task card-body"></div>').css(
        'border-color',
        colors.getForPriority(task.priority)
      );

      taskElement.html(getTaskHTML(task));

      // Event binding
      taskElement.find('.edit-button').click(() => handleEdit(index));
      taskElement.find('.delete-button').click(() => handleDelete(index));

      elements.taskList.append(taskElement);
    };

    const displayTasks = () => {
      elements.taskList.empty();

      if (tasks.length === 0) {
        displayEmptyMessage();
        return;
      }

      const filteredTasks = getFilteredTasks();
      filteredTasks.forEach((task, index) => createTaskElement(task, index));
    };

    // Initialize
    const init = () => {
      loadTasks();

      // Bind events
      elements.addTaskForm.submit(handleTaskSubmit);
      elements.searchButton.click(displayTasks);
      elements.clearButton.click(() => {
        elements.searchInput.val('');
        displayTasks();
      });

      displayTasks();
    };


    return {
      init,
    };
  };

  // Create and initialize task manager
  const taskManager = createTaskManager();
  taskManager.init();
});
