const axios = require('axios');
const colors = require('colors/safe');

const API_URL = 'http://localhost:3000/api/tasks';

// Helper function to print section headers
const printHeader = (text) => {
  console.log(colors.blue('\n=== ' + text + ' ==='));
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    console.error(colors.red('Error:'), error.response.data);
    console.error(colors.yellow('Status:'), error.response.status);
    if (error.response.status === 500) {
      console.error(colors.yellow('Server Error Details:'), error.response.data);
    }
  } else {
    console.error(colors.red('Error:'), error.message);
  }
};

async function testAPI() {
  try {
    // Create a task
    printHeader('Creating a task');
    const createResponse = await axios.post(API_URL, {
      description: 'Test the API endpoints',
      assignedTo: 'John Doe',
      dueDate: '2024-12-31',
      priority: 'high',
      status: 'in progress',
    });
    const secondResponse = await axios.post(API_URL, {
      description: 'Test the API endpoints',
      assignedTo: 'Jane Doe',
      dueDate: '2024-10-31',
      priority: 'low',
      status: 'completed',
    });
    console.log(colors.green('Created first task:'), createResponse.data);
    console.log(colors.green('Created second task:'), secondResponse.data);
    const taskId = createResponse.data.id;

    // Get all tasks
    printHeader('Getting all tasks');
    const allTasks = await axios.get(API_URL);
    console.log(colors.green('All tasks:'), allTasks.data, '\n', colors.yellow('Total tasks:'), allTasks.data.length);

    // Get one task
    printHeader('Getting one task');
    const oneTask = await axios.get(`${API_URL}/${taskId}`);
    console.log(colors.green('One task:'), oneTask.data);

    // Update task
    printHeader('Updating task');
    const updateResponse = await axios.put(`${API_URL}/${taskId}`, {
      description: 'Updated test task',
      assignedTo: 'John Doe',
      dueDate: '2024-12-31',
      priority: 'medium',
      status: 'completed',
    });
    console.log(colors.green('Updated task:'), updateResponse.data);

    // Search for tasks
    printHeader('Searching for tasks');
    const searchResponse = await axios.get(`${API_URL}/search?query=jane`);
    console.log(colors.green('Search results:'), searchResponse.data, '\n', colors.yellow('Total tasks:'), searchResponse.data.length);

    // Delete task
    printHeader('Deleting task');
    const deleteResponse = await axios.delete(`${API_URL}/${taskId}`);
    console.log(colors.green('Delete status:'), deleteResponse.status);

    // Verify deletion
    printHeader('Verifying deletion');
    try {
      await axios.get(`${API_URL}/${taskId}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(colors.green('Task successfully deleted (404 response)'));
      } else {
        throw error;
      }
    }

    console.log(colors.blue('\nAll tests completed successfully!'));
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

// 🏃🏼‍♂️🏃🏼‍♂️🏃🏼‍♂️
testAPI();
