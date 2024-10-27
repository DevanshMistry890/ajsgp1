$(document).ready(function() {
    const taskListElement = $('#task-list');
    const searchInput = $('#search-input');
    const searchButton = $('#search-button');
    const addTaskForm = $('#add-task-form');
    const taskDescriptionInput = $('#task-description');
    const assignedToInput = $('#assigned-to');
    const dueDateInput = $('#due-date');
    const priorityInput = $('#priority');
    const statusInput = $('#status');

    let tasks = [];

    // Load tasks from localStorage on page load
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }

    // Add task to list and localStorage
    addTaskForm.submit(function(event) {
        event.preventDefault();
        const task = {
            description: taskDescriptionInput.val(),
            assignedTo: assignedToInput.val(),
            dueDate: dueDateInput.val(),
            priority: priorityInput.val(),
            status: statusInput.val()
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        $(this).trigger('reset');
    });

    // Display tasks in the list
    function displayTasks() {
        taskListElement.empty();
        const filteredTasks = searchInput.val() ? tasks.filter(task => task.description.toLowerCase().includes(searchInput.val().toLowerCase()) || task.assignedTo.toLowerCase().includes(searchInput.val().toLowerCase())) : tasks;
        filteredTasks.forEach((task, index) => {
            const taskElement = $('<div class="task card-body"></div>');
            taskElement.html(`
                <div class="task-description">${task.description}</div>
                <div class="task-assigned-to">Assigned to: ${task.assignedTo}</div>
                <div class="task-due-date">Due Date: ${task.dueDate}</div>
                <div class="task-priority">Priority: ${task.priority}</div>
                <div class="task-status">Status: ${task.status}</div>
                <button class="delete-button">Delete</button>
            `);
            taskElement.find('.delete-button').click(function() {
                deleteTask(index);
            });
            taskListElement.append(taskElement);
        });
    }

    // Delete task from list and localStorage
    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }

    // Search for tasks
    searchButton.click(function() {
        displayTasks();
    });

    $('#clear-button').click(function() {
        $('#search-input').val('');
        displayTasks();
    });
});