import { useState, useCallback, useEffect } from 'react';
import { Todo } from '../types/todo';
import { todoApi } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load todos';
      setError(message);
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    try {
      setError(null);
      const newTodo = await todoApi.create(trimmed);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add todo';
      setError(message);
      console.error('Error adding todo:', err);
      throw err; // Re-throw so UI can handle it
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.completed;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)),
    );

    try {
      setError(null);
      const updatedTodo = await todoApi.update(id, newCompleted);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t)),
      );
    } catch (err) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t)),
      );
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
      console.error('Error updating todo:', err);
    }
  }, [todos]);

  const removeTodo = useCallback(async (id: string) => {
    // Store the todo in case we need to revert
    const todoToRemove = todos.find((t) => t.id === id);
    
    // Optimistic update - remove from UI immediately
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      setError(null);
      await todoApi.delete(id);
    } catch (err) {
      // Revert on error
      if (todoToRemove) {
        setTodos((prev) => [...prev, todoToRemove].sort((a, b) => Number(a.id) - Number(b.id)));
      } else {
        loadTodos();
      }
      const message = err instanceof Error ? err.message : 'Failed to remove todo';
      setError(message);
      console.error('Error removing todo:', err);
    }
  }, [todos, loadTodos]);

  return { todos, loading, error, addTodo, toggleTodo, removeTodo, refresh: loadTodos };
};
