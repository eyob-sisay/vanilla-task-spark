import { Task, CreateTaskData, UpdateTaskData } from '@/types/Task';

const BASE_URL = 'http://localhost:8000';

export async function getTasks(status?: string): Promise<Task[]> {
  const url = status ? `${BASE_URL}/tasks?status=${status}` : `${BASE_URL}/tasks`;
  const token = localStorage.getItem('auth_token');
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getTask(id: number): Promise<Task> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createTask(task: CreateTaskData): Promise<Task> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateTask(id: number, task: UpdateTaskData): Promise<Task> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}