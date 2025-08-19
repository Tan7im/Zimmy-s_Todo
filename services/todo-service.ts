import { Todo } from '@/types/todo';

class TodoService {
  private readonly STORAGE_KEY = 'todos';

  getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const todos = JSON.parse(stored);
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  addTodo(text: string): Todo {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const todos = this.getTodos();
    todos.unshift(newTodo);
    this.saveTodos(todos);
    
    return newTodo;
  }

  updateTodo(id: string, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Todo | null {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index === -1) return null;

    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveTodos(todos);
    return todos[index];
  }

  deleteTodo(id: string): boolean {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) return false;
    
    this.saveTodos(filteredTodos);
    return true;
  }

  toggleTodo(id: string): Todo | null {
    const todos = this.getTodos();
    const todo = todos.find(t => t.id === id);
    
    if (!todo) return null;
    
    return this.updateTodo(id, { completed: !todo.completed });
  }
}

export const todoService = new TodoService();
