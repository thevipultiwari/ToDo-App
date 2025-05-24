// Task Class to handle individual tasks
class Task {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = new Date();
    }
}

// Main Application Class
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addTask');
        this.taskList = document.getElementById('taskList');
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompletedBtn = document.getElementById('clearCompleted');

        // Initialize the app
        this.init();
    }

    init() {
        // Load tasks from localStorage
        this.loadTasks();
        
        // Add event listeners
        this.addEventListeners();
        
        // Render initial tasks
        this.renderTasks();
    }

    addEventListeners() {
        // Add task button click
        this.addButton.addEventListener('click', () => this.addTask());
        
        // Enter key press in input field
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentFilter = button.dataset.filter;
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.renderTasks();
            });
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderTasks();
        });

        // Clear completed button
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTask() {
        const text = this.taskInput.value.trim();
        
        // Validate input
        if (!text) return;
        
        // Create new task with unique ID
        const task = new Task(Date.now(), text);
        
        // Add to tasks array
        this.tasks.push(task);
        
        // Save to localStorage
        this.saveTasks();
        
        // Clear input
        this.taskInput.value = '';
        
        // Re-render tasks
        this.renderTasks();
    }

    renderTasks() {
        // Clear the task list
        this.taskList.innerHTML = '';
        
        // Filter tasks based on current filter and search term
        const filteredTasks = this.tasks.filter(task => {
            const matchesFilter = this.currentFilter === 'all' || 
                (this.currentFilter === 'active' && !task.completed) ||
                (this.currentFilter === 'completed' && task.completed);
                
            const matchesSearch = task.text.toLowerCase().includes(this.searchTerm);
            
            return matchesFilter && matchesSearch;
        });
        
        // Create and append task elements
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            // Add event listeners
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => this.editTask(task.id));
            
            this.taskList.appendChild(li);
        });
        
        // Update task count
        this.updateTaskCount();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks).map(task => {
                return new Task(task.id, task.text, task.completed);
            });
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    updateTaskCount() {
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        this.taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
