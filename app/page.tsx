"use client"

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { todoService } from '@/services/todo-service';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@/components/modal';
import { ToastContainer } from '@/components/toast-container';
import { TodoForm } from '@/components/todo-form';
import { TodoItem } from '@/components/todo-item';
import { Sun, Moon, CheckCircle, Circle, Trash2 } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; todoId: string | null }>({
    isOpen: false,
    todoId: null
  });
  
  const { theme, toggleTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  // Load todos on mount
  useEffect(() => {
    setTodos(todoService.getTodos());
  }, []);

  const handleAddTodo = (text: string) => {
    try {
      const newTodo = todoService.addTodo(text);
      setTodos(todoService.getTodos());
      addToast('Todo added successfully!', 'success');
    } catch (error) {
      addToast('Failed to add todo', 'error');
    }
  };

  const handleToggleTodo = (id: string) => {
    try {
      const updatedTodo = todoService.toggleTodo(id);
      if (updatedTodo) {
        setTodos(todoService.getTodos());
        addToast(
          updatedTodo.completed ? 'Todo completed!' : 'Todo marked as active',
          'success'
        );
      }
    } catch (error) {
      addToast('Failed to update todo', 'error');
    }
  };

  const handleUpdateTodo = (id: string, text: string) => {
    try {
      const updatedTodo = todoService.updateTodo(id, { text });
      if (updatedTodo) {
        setTodos(todoService.getTodos());
        addToast('Todo updated successfully!', 'success');
      }
    } catch (error) {
      addToast('Failed to update todo', 'error');
    }
  };

  const handleDeleteTodo = (id: string) => {
    setDeleteModal({ isOpen: true, todoId: id });
  };

  const confirmDelete = () => {
    if (deleteModal.todoId) {
      try {
        const success = todoService.deleteTodo(deleteModal.todoId);
        if (success) {
          setTodos(todoService.getTodos());
          addToast('Todo deleted successfully!', 'success');
        }
      } catch (error) {
        addToast('Failed to delete todo', 'error');
      }
    }
    setDeleteModal({ isOpen: false, todoId: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, todoId: null });
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Todo App
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and get things done
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <TodoForm onSubmit={handleAddTodo} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize flex items-center gap-2 ${
                filter === filterType
                  ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              {filterType === 'completed' ? (
                <CheckCircle className="w-4 h-4" />
              ) : filterType === 'active' ? (
                <Circle className="w-4 h-4" />
              ) : null}
              {filterType}
              {filterType === 'all' && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{stats.total}</span>}
              {filterType === 'active' && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{stats.active}</span>}
              {filterType === 'completed' && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{stats.completed}</span>}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Circle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                {filter === 'all' ? 'No todos yet' : 
                 filter === 'active' ? 'No active todos' : 'No completed todos'}
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {filter === 'all' ? 'Add your first todo above to get started!' :
                 filter === 'active' ? 'All your todos are completed!' : 'Complete some todos to see them here.'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          title="Delete Todo"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <Trash2 className="w-6 h-6" />
              <p>Are you sure you want to delete this todo?</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
