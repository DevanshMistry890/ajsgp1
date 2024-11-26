const fs = require('fs').promises;
const path = require('path');

const TEST_TASKS_FILE = path.join(__dirname, '../../data/test_tasks.json');

// Important: Add a dummy test to satisfy Jest
test('dummy test', () => {
  expect(true).toBe(true);
});

beforeEach(async () => {
  // Initialize with empty array instead of resetting
  if (!(await fileExists(TEST_TASKS_FILE))) {
    await fs.writeFile(TEST_TASKS_FILE, '[]');
  }
});

afterAll(async () => {
  try {
    await fs.unlink(TEST_TASKS_FILE);
  } catch (error) {
    // Ignore if file doesn't exist
  }
});

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
