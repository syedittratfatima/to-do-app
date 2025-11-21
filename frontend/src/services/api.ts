import { API_BASE_URL } from '../config/api';
import { Todo } from '../types/todo';

// Backend returns id as number, but we'll convert to string for consistency
type BackendTodo = {
  id: number;
  text: string;
  completed: boolean;
};

const convertTodo = (todo: BackendTodo): Todo => ({
  ...todo,
  id: String(todo.id),
});

const convertTodoToBackend = (todo: { text: string } | { completed: boolean }) => todo;

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }
      const data: BackendTodo[] = await response.json();
      return data.map(convertTodo);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  async create(text: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Failed to create todo: ${response.statusText}`);
      }
      const data: BackendTodo = await response.json();
      return convertTodo(data);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  async update(id: string, completed: boolean): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Failed to update todo: ${response.statusText}`);
      }
      const data: BackendTodo = await response.json();
      return convertTodo(data);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Failed to delete todo: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};

