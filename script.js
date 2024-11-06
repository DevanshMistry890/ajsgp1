/* Group 7 AJS Project */

$(document).ready(function () {

  const taskListElement = $('#task-list');
  const searchInput = $('#search-input');
  const searchButton = $('#search-button');
  const addTaskForm = $('#add-task-form');
  const taskDescriptionInput = $('#task-description');
  const assignedToInput = $('#assigned-to');
  const dueDateInput = $('#due-date');
  const priorityInput = $('#priority');
  const statusInput = $('#status');
  const headinglbl = $('#heading');

  let tasks = [];
  let editIndex = -1;

  // Load tasks from localStorage
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    displayTasks();
  }

  // Add or edit task
  addTaskForm.submit(function (event) {
    event.preventDefault();
    const task = {
      description: taskDescriptionInput.val(),
      assignedTo: assignedToInput.val(),
      dueDate: dueDateInput.val(),
      priority: priorityInput.val(),
      status: statusInput.val(),
    };

    if (editIndex === -1) {
      // Add a new task
      tasks.push(task);
    } else {
      // Edit an existing task & reset label
      tasks[editIndex] = task;
      headinglbl.text('Add Task').removeClass('flash');
      editIndex = -1;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();

    $(this).trigger('reset');
  });

  // Display tasks in the list
  function displayTasks() {
    taskListElement.empty();
    if (tasks.length === 0) {
      taskListElement.append(
        '<div class="no-tasks-message" style="text-align: center;">No tasks available. Please add a task.</div>'
      );
      return;
    }
    const filteredTasks = searchInput.val()
      ? tasks.filter(
        (task) =>
          task.description
            .toLowerCase()
            .includes(searchInput.val().toLowerCase()) ||
          task.assignedTo
            .toLowerCase()
            .includes(searchInput.val().toLowerCase())
      )
      : tasks;

    filteredTasks.forEach((task, index) => {
      const taskElement = $('<div class="task card-body"></div>').css(
        'border-color',
        getPriorityColor(task.priority)
      );
      taskElement.html(`
                <div class="task-description">Description: ${task.description}</div>
                <div class="task-assigned-to">Assigned to: ${task.assignedTo}</div>
                <div class="task-due-date">Due Date: ${task.dueDate}</div>
                <div class="task-priority" style="color: ${getPriorityColor(task.priority)};">Priority: ${task.priority}</div>
                <div class="task-status" style="color: ${getStatusColor(task.status)};">Status: ${task.status}</div>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
        `);
      taskElement.find('.edit-button').click(function () {
        editTask(index);
      });
      taskElement.find('.delete-button').click(function () {
        deleteTask(index);
      });
      taskListElement.append(taskElement);
    });
  }

  // Edit task
  function editTask(index) {

    //Edit msg and adds animation to grab user attention
    headinglbl.text('Edit task here').addClass('flash');
    $('html, body').animate({
      scrollTop: headinglbl.offset().top
    }, 'slow'); //scroll user to label


    const task = tasks[index];
    taskDescriptionInput.val(task.description);
    assignedToInput.val(task.assignedTo);
    dueDateInput.val(task.dueDate);
    priorityInput.val(task.priority);
    statusInput.val(task.status);
    editIndex = index;

  }

  // Delete task from list and localStorage
  function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
  }

  // Search for tasks
  searchButton.click(function () {
    displayTasks();
  });

  // clear filter and show all task
  $('#clear-button').click(function () {
    $('#search-input').val('');
    displayTasks();
  });

  // Get color based on priority
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return '#FF6347';
      case 'medium':
        return '#FFA500';
      case 'low':
        return '#40ec2d';
      default:
        return '#CCCCCC';
    }
  }

  // Get color based on status
  function getStatusColor(status) {
    switch (status) {
      case 'not started':
        return '#808080';
      case 'in progress':
        return '#1E90FF';
      case 'completed':
        return '#32CD32';
      default:
        return '#CCCCCC';
    }
  }
});
