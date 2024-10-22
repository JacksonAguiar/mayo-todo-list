document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const loginForm = document.getElementById('login-form');
  
    const getToken = () => localStorage.getItem('token');
  
    const loadTasks = async () => {
      const token = getToken();
      if (!token) {
        window.location.href = '/login.html';
        return;
      }
  
      const response = await fetch('/api/tasks', {
        headers: { 'Authorization': token }
      });
      const tasks = await response.json();
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="${task.status === 'complete' ? 'complete' : ''}">${task.title}</span>
          <button class="toggle" data-id="${task._id}">${task.status === 'complete' ? 'Reativar' : 'Completar'}</button>
          <button class="delete" data-id="${task._id}">Excluir</button>
        `;
        taskList.appendChild(li);
      });
    };
  
    if (taskForm) {
      taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value;
        const token = getToken();
        if (!title || !token) return;
  
        await fetch('/api/tasks/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ title }),
        });
        taskInput.value = '';
        loadTasks();
      });
    }
  
    if (taskList) {
      taskList.addEventListener('click', async (e) => {
        const token = getToken();
        if (!token) return;
  
        if (e.target.classList.contains('toggle')) {
          const taskId = e.target.dataset.id;
          await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Authorization': token }
          });
          loadTasks();
        }
  
        if (e.target.classList.contains('delete')) {
          const taskId = e.target.dataset.id;
          await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
          });
          loadTasks();
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/index.html';
        } else {
          alert(data.message);
        }
      });
    }
    
    if (taskList) {
      loadTasks();
    }
  });
  