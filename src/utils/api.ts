import { Task, CreateTaskData, UpdateTaskData } from '@/types/Task';

const BASE_URL = 'http://localhost:8000';

export async function getTasks(status?: string): Promise<Task[]> {
  const url = status ? `${BASE_URL}/tasks?status=${status}` : `${BASE_URL}/tasks`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getTask(id: number): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createTask(task: CreateTaskData): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateTask(id: number, task: UpdateTaskData): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
  
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}