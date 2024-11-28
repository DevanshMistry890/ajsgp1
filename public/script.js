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

  let editIndex = -1;

  // Load tasks from API
  function loadTasks() {
    $.get('/api/tasks', function (tasks) {
      displayTasks(tasks);
    }).fail(function () {
      alert('Failed to load tasks');
    });
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
      $.post('/api/tasks', task, function () {
        loadTasks();
        $(this).trigger('reset');
      }).fail(function () {
        alert('Failed to create task');
      });
    } else {
      // Edit an existing task
      $.ajax({
        url: '/api/tasks/${editIndex}',
        method: 'PUT',
        data: task,
        success: function () {
          loadTasks();
          headinglbl.text('Add Task').removeClass('flash');
          editIndex = -1;
          $(this).trigger('reset');
        },
        fail: function () {
          alert('Failed to update task');
        }
      });
    }
  });

  // Display tasks in the list
  function displayTasks(tasks) {
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
        editTask(task.id);
      });
      taskElement.find('.delete-button').click(function () {
        deleteTask(task.id);
      });
      taskListElement.append(taskElement);
    });
  }

  // Edit task
  function editTask(taskId) {
    //Edit msg and adds animation to grab user attention
    headinglbl.text('Edit task here').addClass('flash');
    $('html, body').animate({
      scrollTop: headinglbl.offset().top
    }, 'slow'); //scroll user to label

    $.get('/api/tasks/${taskId}', function (task) {
      taskDescriptionInput.val(task.description);
      assignedToInput.val(task.assignedTo);
      dueDateInput.val(task.dueDate);
      priorityInput.val(task.priority);
      statusInput.val(task.status);
      editIndex = taskId;
    }).fail(function () {
      alert('Failed to load task for editing');
    });
  }

  // Delete task from list via API
  function deleteTask(taskId) {
    $.ajax({
      url: '/api/tasks/${taskId}',
      method: 'DELETE',
      success: function () {
        loadTasks();
      },
      fail: function () {
        alert('Failed to delete task');
      }
    });
  }

  // Search for tasks
  searchButton.click(function () {
    let query = $('#search-input').val();
    $.get('/api/tasks/search', { query: query }, function (tasks) {
      displayTasks(tasks);
    }).fail(function () {
      alert('Failed to search tasks');
    });
  });

  // Clear search input and show all tasks
  $('#clear-button').click(function () {
    $('#search-input').val('');
    loadTasks();
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

  // Load tasks initially
  loadTasks();
});
