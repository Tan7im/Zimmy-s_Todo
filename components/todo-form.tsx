import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  buttonText?: string;
  initialValue?: string;
}

export function TodoForm({ 
  onSubmit, 
  placeholder = "Add a new todo...", 
  buttonText = "Add Todo",
  initialValue = ""
}: TodoFormProps) {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError('Please enter a todo item');
      return;
    }

    if (trimmedText.length > 200) {
      setError('Todo must be less than 200 characters');
      return;
    }

    onSubmit(trimmedText);
    setText('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            maxLength={200}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{buttonText}</span>
        </button>
      </div>
    </form>
  );
}
